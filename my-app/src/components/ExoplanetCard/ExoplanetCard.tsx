import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { mediaUrl } from '../../modules/media';
import type { Exoplanet } from '../../types/exoplanet';

import './ExoplanetCard.css';

interface ExoplanetCardProps {
  exoplanet: Exoplanet;
  onDelete?: () => void;
}

function ExoplanetCard({ exoplanet, onDelete }: ExoplanetCardProps) {
  const navigate = useNavigate();

  //изображение по умолчанию задается, если exoplanet.image ноль
  const imageSrc = mediaUrl(exoplanet.image, '/DefaultImage.png');

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

        {onDelete && (
          <Button className="mt-2" variant="outline-light" onClick={onDelete}>
            Удалить
          </Button>
        )}
      </Card.Body>

    </Card>
  );
}

export default ExoplanetCard;