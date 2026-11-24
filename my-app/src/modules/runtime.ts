export const pagesMock = import.meta.env.MODE === 'pages';

export function publicAsset(name: string) {
  return `${import.meta.env.BASE_URL}${name.replace(/^\/+/, '')}`;
}
