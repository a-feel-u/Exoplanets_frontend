type PlanetPreference = 'published' | 'liked';

export function readPlanetIds(userId: number | null, preference: PlanetPreference): number[] {
  if (userId === null) return [];
  try {
    const stored = JSON.parse(localStorage.getItem(`exoplanets.${preference}.${userId}`) ?? '[]');
    return Array.isArray(stored) ? stored.filter(Number.isSafeInteger) : [];
  } catch {
    return [];
  }
}

export function setPlanetPreference(userId: number | null, preference: PlanetPreference, id: number, enabled: boolean) {
  if (userId === null) return;
  const ids = new Set(readPlanetIds(userId, preference));
  if (enabled) ids.add(id);
  else ids.delete(id);

  try {
    localStorage.setItem(`exoplanets.${preference}.${userId}`, JSON.stringify([...ids]));
  } catch {
    // Запись на сервере уже состоялась. Хранилище влияет только на отображение.
  }
}
