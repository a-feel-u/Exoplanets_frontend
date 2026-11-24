
import { useEffect } from 'react';

import { deleteExoplanet, getExoplanets, selectExoplanetsLoading } from '../../slices/exoplanetsSlice';

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

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const filteredExoplanets = useAppSelector((state) => state.exoplanets.items);
  const error = useAppSelector((state) => state.exoplanets.error);
  const isLoading = useAppSelector(selectExoplanetsLoading);

  useEffect(() => {
    const request = dispatch(getExoplanets({ search: appliedSearch, filter: selectedFilter }));
    return () => request.abort();
  }, [dispatch, appliedSearch, selectedFilter, isAuthenticated]);

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
              onDelete={isAuthenticated && exoplanet.canDelete ? () => {
                if (window.confirm(`Удалить «${exoplanet.title}»?`)) {
                  void dispatch(deleteExoplanet(exoplanet.id));
                }
              } : undefined}
            />

          ))}

        </div>

      ) : !isLoading && !error ? (

        <div className="grid-empty">
          <h5>Ничего не найдено</h5>

          <p>
            Попробуйте изменить поисковый запрос или условия фильтрации.
          </p>
        </div>

      ) : null}

    </div>
  );
}

export default GridPage;
