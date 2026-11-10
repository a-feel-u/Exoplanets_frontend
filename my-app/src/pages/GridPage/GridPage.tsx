import { useMemo, useState } from 'react';

import { EXOPLANETS_MOCK } from '../../modules/mock';

import ExoplanetCard from '../../components/ExoplanetCard/ExoplanetCard';

import Filter, {
  type ExoplanetFilterType,
} from '../../components/Filter/Filter';

import './GridPage.css';

function GridPage() {
  //текст введённый в поле поиска
  const [searchValue, setSearchValue] = useState('');

  //применённый поисковый запрос
  const [appliedSearch, setAppliedSearch] = useState('');

  //выбранное условие фильтрации
  const [selectedFilter, setSelectedFilter] =
    useState<ExoplanetFilterType>('all');

  //отфильтрованный список
  const filteredExoplanets = useMemo(() => {
    return EXOPLANETS_MOCK.filter((exoplanet) => {

      //поиск по названию и описанию
      const normalizedSearch = appliedSearch.toLowerCase();

      const matchesSearch =
        exoplanet.title.toLowerCase().includes(normalizedSearch) ||
        exoplanet.description.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      //фильтрация по характеристикам
      switch (selectedFilter) {
        case 'nearby':
          return exoplanet.distance <= 10;

        case 'distant':
          return exoplanet.distance > 10;

        case 'light':
          return exoplanet.weight < 1;

        case 'heavy':
          return exoplanet.weight >= 1;

        default:
          return true;
      }
    });
  }, [appliedSearch, selectedFilter]);

  //применяем поисковый запрос
  const handleSearchSubmit = () => {
    setAppliedSearch(searchValue.trim());
  };

  return (
    <div className="grid-page">

      {/* Компонент поиска и фильтрации */}
      <Filter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Список карточек */}
      {filteredExoplanets.length > 0 ? (

        <div className="grid-exoplanets">

          {filteredExoplanets.map((exoplanet) => (

            <ExoplanetCard
              key={exoplanet.id}
              exoplanet={exoplanet}
            />

          ))}

        </div>

      ) : (

        <div className="grid-empty">
          <h5>Ничего не найдено</h5>

          <p>
            Попробуйте изменить поисковый запрос или условия фильтрации.
          </p>
        </div>

      )}

    </div>
  );
}

export default GridPage;