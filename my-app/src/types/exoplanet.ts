export interface Exoplanet {
  id: number;
  title: string;
  status: string;
  distance: number;
  weight: number;
  description: string;
  image: string;
  video: string;
}
export interface PublishedExoplanet extends Exoplanet {
  likes_number?: number;
  is_mine?: boolean;
  is_liked?: boolean;
  canDelete?: boolean;
  likedInBrowser?: boolean;
}
