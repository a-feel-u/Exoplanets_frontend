export function mediaUrl(value: string | undefined, fallback: string) {
  const source = value?.trim();
  if (!source) return fallback;
  if (source.startsWith('/')) return source;

  try {
    const url = new URL(source);
    if (url.port === '9000' && ['127.0.0.1', 'localhost', 'minio'].includes(url.hostname)) {
      return `/s3${url.pathname}${url.search}`;
    }
    return source;
  } catch {
    // API может вернуть имя файла из public без начального слеша.
    return `/${source}`;
  }
}
