import axios from 'axios';
import { createAsyncThunk, createSlice, isAnyOf, isPending, isRejected } from '@reduxjs/toolkit';

import { exoplanetsApi } from '../api/Api';
import { bearerConfig, requestError } from '../api/auth';
import type { RootState } from '../app/store';
import { EXOPLANETS_MOCK } from '../modules/mock';
import { pagesMock } from '../modules/runtime';
import { readPlanetIds, setPlanetPreference } from '../modules/planetPreferences';
import type { Exoplanet, PublishedExoplanet } from '../types/exoplanet';
import type { ExoplanetFilterType } from './filterSlice';
import { clearAuthenticatedUser } from './userSlice';

const exoplanetThunk = createAsyncThunk.withTypes<{ state: RootState; rejectValue: string }>();

interface CatalogFilters {
  search?: string;
  filter?: ExoplanetFilterType;
}

function matchesText(planet: Exoplanet, text: string) {
  return planet.title.toLowerCase().includes(text) || planet.description.toLowerCase().includes(text);
}

function matchesCategory(planet: Exoplanet, filter: ExoplanetFilterType | undefined) {
  switch (filter) {
    case 'nearby': return planet.distance <= 10;
    case 'distant': return planet.distance > 10;
    case 'light': return planet.weight < 1;
    case 'heavy': return planet.weight >= 1;
    default: return true;
  }
}

function serviceUnavailable(error: unknown) {
  return axios.isAxiosError(error) && !axios.isCancel(error) &&
    (!error.response || [502, 503, 504].includes(error.response.status));
}

async function loadCatalog(filters: CatalogFilters, user: RootState['user'], signal: AbortSignal) {
  const search = filters.search?.trim() ?? '';
  const weight = /^\d+(?:[.,]\d+)?$/.test(search) ? search.replace(',', '.') : undefined;
  const text = weight === undefined ? search.toLowerCase() : '';
  const canShow = (planet: Exoplanet) => matchesText(planet, text) && matchesCategory(planet, filters.filter);
  const mockCatalog = () => ({
      items: EXOPLANETS_MOCK.filter((planet) => canShow(planet) &&
        (weight === undefined || planet.weight === Number(weight))),
      source: 'mock' as const,
    });
  if (pagesMock) return mockCatalog();

  const config = { ...(user.isAuthenticated ? bearerConfig() : {}), signal, timeout: 6_000 };

  try {
    const { data } = await exoplanetsApi.getExoplanets({ query: weight }, config);
    const { exoplanets } = data as { exoplanets: PublishedExoplanet[] | null };
    const published = new Set(readPlanetIds(user.userId, 'published'));
    return {
      items: (exoplanets ?? []).filter(canShow).map((planet) => ({
        ...planet,
        canDelete: Boolean(planet.is_mine || published.has(planet.id)),
      })),
      source: 'api' as const,
    };
  } catch (error) {
    if (user.isAuthenticated || !serviceUnavailable(error)) throw error;
    return mockCatalog();
  }
}

async function loadPublishedExoplanet(id: number, user: RootState['user'], signal?: AbortSignal) {
  const { data } = await exoplanetsApi.getExoplanet(id, {}, {
    ...(user.isAuthenticated ? bearerConfig() : {}), signal, timeout: 6_000,
  });
  const { exoplanets: planet } = data as { exoplanets: PublishedExoplanet };
  return {
    ...planet,
    likedInBrowser: Boolean(planet.is_liked || readPlanetIds(user.userId, 'liked').includes(id)),
  };
}

export const getExoplanets = exoplanetThunk('exoplanets/getExoplanets',
  async (filters: CatalogFilters, { getState, signal, rejectWithValue }) => {
    try {
      return await loadCatalog(filters, getState().user, signal);
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const getExoplanetFeed = exoplanetThunk('exoplanets/getExoplanetFeed',
  async (id: number | undefined, { getState, signal, rejectWithValue }) => {
    const user = getState().user;
    try {
      const { items: catalog, source } = await loadCatalog({}, user, signal);
      const selected = id === undefined ? catalog[0] : catalog.find((planet) => planet.id === id);
      if (source === 'mock' || !selected) return { catalog, planet: selected ?? null, source };
      try {
        const planet = await loadPublishedExoplanet(selected.id, user, signal);
        return { catalog, planet, source };
      } catch (error) {
        if (user.isAuthenticated || !serviceUnavailable(error)) throw error;
        const planet = EXOPLANETS_MOCK.find((item) => item.id === selected.id) ?? null;
        return { catalog: EXOPLANETS_MOCK, planet, source: 'mock' as const };
      }
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const getDraftExoplanet = exoplanetThunk('exoplanets/getDraftExoplanet',
  async (_, { signal, rejectWithValue }) => {
    try {
      const { data } = await exoplanetsApi.getDraftExoplanet({ ...bearerConfig(), signal });
      return (data as { exoplanet: Exoplanet | null }).exoplanet;
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const addDraftExoplanet = exoplanetThunk('exoplanets/addDraftExoplanet',
  async (fields: Parameters<typeof exoplanetsApi.addDraftExoplanet>[0], { rejectWithValue }) => {
    try {
      const config = bearerConfig();
      await exoplanetsApi.addDraftExoplanet(fields, config);
      // POST возвращает запись до заполнения URL загруженных файлов.
      const { data } = await exoplanetsApi.getDraftExoplanet(config);
      return (data as { exoplanet: Exoplanet | null }).exoplanet;
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const publishExoplanet = exoplanetThunk('exoplanets/publishExoplanet',
  async (fields: Parameters<typeof exoplanetsApi.publishExoplanet>[0], { getState, rejectWithValue }) => {
    try {
      const { data } = await exoplanetsApi.publishExoplanet(fields, bearerConfig());
      const { exoplanet } = data as { exoplanet: Exoplanet | null };
      if (!exoplanet) throw new Error('Сервер не вернул опубликованную экзопланету.');
      setPlanetPreference(getState().user.userId, 'published', exoplanet.id, true);
      return exoplanet;
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const deleteExoplanet = exoplanetThunk('exoplanets/deleteExoplanet',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      await exoplanetsApi.deleteExoplanet(id, bearerConfig());
      setPlanetPreference(getState().user.userId, 'published', id, false);
      return id;
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

export const likeExoplanet = exoplanetThunk('exoplanets/likeExoplanet',
  async ({ id, like }: { id: number; like: boolean }, { getState, rejectWithValue }) => {
    const user = getState().user;
    try {
      await exoplanetsApi.likeExoplanet(id, { like }, bearerConfig());
      setPlanetPreference(user.userId, 'liked', id, like);
      const planet = await loadPublishedExoplanet(id, user);
      return { ...planet, likedInBrowser: like };
    } catch (error) {
      return rejectWithValue(requestError(error));
    }
  },
);

type CatalogSource = 'api' | 'mock' | null;

interface ExoplanetsState {
  items: PublishedExoplanet[];
  catalogSource: CatalogSource;
  feed: { catalog: PublishedExoplanet[]; planet: PublishedExoplanet | null; source: CatalogSource };
  draft: Exoplanet | null;
  pending: Record<string, true>;
  error: string | null;
}

const initialState: ExoplanetsState = {
  items: [],
  catalogSource: null,
  feed: { catalog: [], planet: null, source: null },
  draft: null,
  pending: {},
  error: null,
};

const requests = [
  getExoplanets, getExoplanetFeed, getDraftExoplanet, addDraftExoplanet,
  publishExoplanet, deleteExoplanet, likeExoplanet,
] as const;

const exoplanetsSlice = createSlice({
  name: 'exoplanets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clearAuthenticatedUser, () => initialState)
      .addCase(getExoplanets.pending, (state) => { state.items = []; state.catalogSource = null; })
      .addCase(getExoplanets.fulfilled, (state, { payload }) => {
        state.items = payload.items;
        state.catalogSource = payload.source;
      })
      .addCase(getExoplanetFeed.pending, (state) => {
        state.feed = initialState.feed;
      })
      .addCase(getExoplanetFeed.fulfilled, (state, { payload }) => { state.feed = payload; })
      .addCase(getDraftExoplanet.fulfilled, (state, { payload }) => { state.draft = payload; })
      .addCase(addDraftExoplanet.fulfilled, (state, { payload }) => { state.draft = payload; })
      .addCase(publishExoplanet.fulfilled, (state) => { state.draft = null; })
      .addCase(deleteExoplanet.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((planet) => planet.id !== payload);
      })
      .addCase(likeExoplanet.fulfilled, (state, { payload }) => {
        if (state.feed.planet?.id === payload.id) state.feed.planet = payload;
      })
      .addMatcher(isPending(...requests), (state, action) => {
        state.pending[action.meta.requestId] = true;
        state.error = null;
      })
      .addMatcher(isRejected(...requests), (state, action) => {
        if (!action.meta.aborted) state.error = action.payload ?? 'Не удалось выполнить запрос.';
      })
      .addMatcher(isAnyOf(...requests.map((request) => request.settled)), (state, action) => {
        delete state.pending[action.meta.requestId];
      });
  },
});

export const selectExoplanetsLoading = (state: RootState) =>
  Object.keys(state.exoplanets.pending).length > 0;

export default exoplanetsSlice.reducer;
