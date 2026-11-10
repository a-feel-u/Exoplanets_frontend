
import { useMemo } from 'react';

import { EXOPLANETS_MOCK } from '../../modules/mock';

import ExoplanetCard from '../../components/ExoplanetCard/ExoplanetCard';
import Filter from '../../components/Filter/Filter';

import {
  applySearch,
  setSearchValue,
  setSelectedFilter,
} from '../../slices/filterSlice';

import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

import './GridPage.css';

function GridPage() {
  // Получаем dispatch для отправки действий в Redux
  const dispatch = useAppDispatch();

  // Получаем значения фильтров из Redux Store
  const {
    searchValue,
    appliedSearch,
    selectedFilter,
  } = useAppSelector((state) => state.filter);

  // Фильтруем mock-коллекцию
  const filteredExoplanets = useMemo(() => {
    return EXOPLANETS_MOCK.filter((exoplanet) => {

      // Поиск по названию и описанию
      const normalizedSearch = appliedSearch.toLowerCase();

      const matchesSearch =
        exoplanet.title.toLowerCase().includes(normalizedSearch) ||
        exoplanet.description.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      // Фильтрация по характеристикам
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

  return (
    <div className="grid-page">

      {/* Компонент поиска и фильтрации */}
      <Filter
        searchValue={searchValue}

        onSearchChange={(value) =>
          dispatch(setSearchValue(value))
        }

        selectedFilter={selectedFilter}

        onFilterChange={(value) =>
          dispatch(setSelectedFilter(value))
        }

        onSearchSubmit={() =>
          dispatch(applySearch())
        }
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
