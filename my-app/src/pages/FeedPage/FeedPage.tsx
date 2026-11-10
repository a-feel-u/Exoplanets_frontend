import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { EXOPLANETS_MOCK } from '../../modules/mock';

import './FeedPage.css';

function FeedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState(false);

  //определяем индекс выбранной экзопланеты
  const selectedIndex = id
    ? EXOPLANETS_MOCK.findIndex(
        (planet) => planet.id === Number(id)
      )
    : 0;

  //если ID некорректный показываем первую экзопланету
  const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

  //получаем выбранную экзопланету
  const exoplanet = EXOPLANETS_MOCK[currentIndex];

  //изображение по умолчанию
  const imageSrc = exoplanet.image || '/DefaultImage.png';

  //видео по умолчанию
  const videoSrc = exoplanet.video || '/DefaultVideo.mp4';

  //сбрасываем раскрытие описания при переключении планет
  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [id]);

  //ограничение длины описания
  const descriptionLimit = 120;

  const isDescriptionLong =
    exoplanet.description.length > descriptionLimit;

  const displayedDescription = isDescriptionExpanded
    ? exoplanet.description
    : exoplanet.description.slice(0, descriptionLimit) +
      (isDescriptionLong ? '...' : '');

  //переход к следующей экзопланете
  const handleNext = () => {
    const nextIndex =
      (currentIndex + 1) % EXOPLANETS_MOCK.length;

    const nextExoplanet = EXOPLANETS_MOCK[nextIndex];

    navigate(`/feed/${nextExoplanet.id}`);
  };

  return (
    <div className="feed-page">

      {/* Видео на фоне */}
      <div className="feed-video-wrapper">
        <video
          key={videoSrc}
          className="feed-video"
          src={videoSrc}
          poster={imageSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Затемнение поверх видео */}
      <div className="feed-gradient" />

      {/* Информация об экзопланете */}
      <div className="feed-overlay">

        {/* Левый блок */}
        <div className="feed-info">

          <h2 className="feed-title">
            {exoplanet.title}
          </h2>

          <p className="feed-description">
            {displayedDescription}
          </p>

          {isDescriptionLong && (
            <Button
              variant="outline-light"
              size="sm"
              className="feed-read-more"
              onClick={() =>
                setIsDescriptionExpanded(
                  !isDescriptionExpanded
                )
              }
            >
              {isDescriptionExpanded
                ? 'Свернуть'
                : 'Читать далее'}
            </Button>
          )}

        </div>

        {/* Правый блок характеристик */}
        <div className="feed-stats">

          <div className="feed-stat">
            <img
              src="/distance.PNG"
              alt="Расстояние"
              className="feed-icon"
            />

            <span className="feed-stat-value">
              {exoplanet.distance}
            </span>

            <span className="feed-stat-label">
              а. е.
            </span>
          </div>

          <div className="feed-stat">
            <img
              src="/weight.PNG"
              alt="Масса"
              className="feed-icon"
            />

            <span className="feed-stat-value">
              {exoplanet.weight}
            </span>

            <span className="feed-stat-label">
              Масса
            </span>
          </div>

          {/* Следующая экзопланета */}
          <button
            type="button"
            className="feed-next-button"
            onClick={handleNext}
            aria-label="Следующая экзопланета"
          >
            <img
              src="/next.PNG"
              alt="Следующая"
              className="feed-next-icon"
            />
          </button>

        </div>

      </div>

    </div>
  );
}

export default FeedPage;