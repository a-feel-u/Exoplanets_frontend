import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ExoplanetFilterType =
  | 'all'
  | 'nearby'
  | 'distant'
  | 'light'
  | 'heavy';

interface FilterState {
  searchValue: string;
  appliedSearch: string;
  selectedFilter: ExoplanetFilterType;
}

const initialState: FilterState = {
  searchValue: '',
  appliedSearch: '',
  selectedFilter: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,

  reducers: {
    // Изменение поисковой строки
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },

    // Применение поискового запроса
    applySearch(state) {
      state.appliedSearch = state.searchValue.trim();
    },

    // Изменение выбранного фильтра
    setSelectedFilter(
      state,
      action: PayloadAction<ExoplanetFilterType>
    ) {
      state.selectedFilter = action.payload;
    },

    // Сброс всех фильтров
    resetFilters(state) {
      state.searchValue = '';
      state.appliedSearch = '';
      state.selectedFilter = 'all';
    },
  },
});

export const {
  setSearchValue,
  applySearch,
  setSelectedFilter,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;