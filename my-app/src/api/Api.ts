// Сгенерировано из Swagger командой npm run generate-api.
import axios, { type AxiosRequestConfig } from 'axios';

const http = axios.create({ timeout: 60_000 });

export const exoplanetsApi = {
  addDraftExoplanet(fields: { title?: string; image?: File; video?: File }, config?: AxiosRequestConfig) {
    const body = new FormData();
    if (fields.title !== undefined) body.append('title', String(fields.title));
    if (fields.image !== undefined) body.append('image', fields.image);
    if (fields.video !== undefined) body.append('video', fields.video);
    return http.post<Record<string, unknown>>("/api/AddExoplanets", body, config);
  },
  deleteExoplanet(id: number, config?: AxiosRequestConfig) {
    return http.delete<Record<string, unknown>>(`/api/DeleteExoplanets/${id}`, config);
  },
  getDraftExoplanet(config?: AxiosRequestConfig) {
    return http.get<Record<string, unknown>>("/api/DraftExoplanets", config);
  },
  getExoplanets(query: { query?: string }, config?: AxiosRequestConfig) {
    return http.get<Record<string, unknown>>("/api/Exoplanets", { ...config, params: query });
  },
  getExoplanet(id: number, query: { next?: boolean }, config?: AxiosRequestConfig) {
    return http.get<Record<string, unknown>>(`/api/Exoplanets/${id}`, { ...config, params: query });
  },
  likeExoplanet(id: number, body: Record<string, boolean>, config?: AxiosRequestConfig) {
    return http.post<Record<string, unknown>>(`/api/LikeExoplanets/${id}/like`, body, config);
  },
  publishExoplanet(fields: { distance?: number; weight?: number; description?: string }, config?: AxiosRequestConfig) {
    const body = new FormData();
    if (fields.distance !== undefined) body.append('distance', String(fields.distance));
    if (fields.weight !== undefined) body.append('weight', String(fields.weight));
    if (fields.description !== undefined) body.append('description', String(fields.description));
    return http.put<Record<string, unknown>>("/api/PublishExoplanets", body, config);
  },
};
