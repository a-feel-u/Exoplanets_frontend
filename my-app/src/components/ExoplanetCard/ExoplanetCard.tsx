import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import type { Exoplanet } from '../../types/exoplanet';

import './ExoplanetCard.css';

interface ExoplanetCardProps {
  exoplanet: Exoplanet;
}

function ExoplanetCard({ exoplanet }: ExoplanetCardProps) {
  const navigate = useNavigate();

  //изображение по умолчанию задается, если exoplanet.image ноль
  const imageSrc = exoplanet.image || '/DefaultImage.png';

  const handleDetailsClick = () => {
    navigate(`/feed/${exoplanet.id}`);
  };

  return (
    <Card className="exoplanet-card h-100">

      <div className="exoplanet-card-image-wrapper">
        <Card.Img
          //здесь задается изображение
          src={imageSrc}
          alt={exoplanet.title}
          className="exoplanet-card-image"
        />
      </div>

      <Card.Body className="exoplanet-card-body">

        <Card.Title className="exoplanet-card-title">
          {exoplanet.title}
        </Card.Title>

        <div className="exoplanet-card-description">

          <p>
            Расстояние до звезды:
            <br />
            {exoplanet.distance} а. е.
          </p>

          <p>
            Масса:
            <br />
            {exoplanet.weight}
          </p>

        </div>

        <Button
          className="exoplanet-card-button"
          variant="outline-light"
          onClick={handleDetailsClick}
        >
          Подробнее
        </Button>

      </Card.Body>

    </Card>
  );
}

export default ExoplanetCard;