import type { FormEvent } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

import './Filter.css';

export type ExoplanetFilterType =
  | 'all'
  | 'nearby'
  | 'distant'
  | 'light'
  | 'heavy';

interface FilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  selectedFilter: ExoplanetFilterType;
  onFilterChange: (value: ExoplanetFilterType) => void;

  onSearchSubmit: () => void;
}

function Filter({
  searchValue,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onSearchSubmit,
}: FilterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="exoplanet-filter">

      {/* Поиск */}
      <Form onSubmit={handleSubmit}>

        <InputGroup className="filter-search">

          <Form.Control
            type="text"
            placeholder="Введите название или описание"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <Button
            type="submit"
            className="filter-search-button"
          >
            Найти
          </Button>

        </InputGroup>

      </Form>

      {/* Фильтрация */}
      <Form.Group className="filter-select-group">

        <Form.Label>
          Фильтр экзопланет
        </Form.Label>

        <Form.Select
          value={selectedFilter}
          onChange={(event) =>
            onFilterChange(event.target.value as ExoplanetFilterType)
          }
        >
          <option value="all">Все экзопланеты</option>
          <option value="nearby">Близкие: до 10 а. е.</option>
          <option value="distant">Далёкие: более 10 а. е.</option>
          <option value="light">Масса меньше 1</option>
          <option value="heavy">Масса от 1</option>
        </Form.Select>

      </Form.Group>

    </div>
  );
}

export default Filter;