import type { Exoplanet } from '../types/exoplanet';

export const EXOPLANETS_MOCK: Exoplanet[] = [
  {
    id: 1,
    title: 'Kepler-22 b',
    status: 'published',
    distance: 40,
    weight: 2.4,
    description:
      'Экзопланета, расположенная в обитаемой зоне своей звезды. Представляет интерес для изучения условий существования жидкой воды.',
    image: '/desert_planet_cut.png',
    video: '/desert_planet.mp4',
  },
  {
    id: 2,
    title: 'Proxima Centauri b',
    status: 'published',
    distance: 4,
    weight: 1.3,
    description:
      'Экзопланета, обращающаяся вокруг ближайшей к Солнцу звезды. Один из интересных объектов для поиска потенциально пригодных для жизни миров.',
    image: '/super_earth_cut.png',
    video: '/super_earth.mp4',
  },
  {
    id: 3,
    title: 'TRAPPIST-1 e',
    status: 'published',
    distance: 40,
    weight: 0.7,
    description:
      'Одна из планет системы TRAPPIST-1. Система содержит несколько экзопланет, которые представляют интерес для астрономических исследований.',
    image: '/ice_giant_cut.png',
    video: '/ice_giant.mp4',
  },
  {
    id: 4,
    title: '51 Pegasi b',
    status: 'published',
    distance: 50,
    weight: 150,
    description:
      'Одна из первых обнаруженных экзопланет у звезды главной последовательности. Относится к классу горячих юпитеров.',
    image: '/hot_jupiter_cut.png',
    video: '/hot_jupiter.mp4',
  },
  {
    id: 5,
    title: 'Test Planet',
    status: 'published',
    distance: 25,
    weight: 3.5,
    description:
      'Демонстрационная экзопланета без собственного изображения и видео. Для неё используются стандартные медиафайлы приложения.',
    image: '',
    video: '',
  },
];