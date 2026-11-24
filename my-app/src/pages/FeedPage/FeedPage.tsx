import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { mediaUrl } from '../../modules/media';
import { getExoplanetFeed, likeExoplanet, selectExoplanetsLoading } from '../../slices/exoplanetsSlice';

import './FeedPage.css';

function ExoplanetFeed({ id }: { id?: string }) {
  const navigate = useNavigate();

  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState(false);

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const { catalog, planet: exoplanet } = useAppSelector((state) => state.exoplanets.feed);
  const isLoading = useAppSelector(selectExoplanetsLoading);
  const error = useAppSelector((state) => state.exoplanets.error);

  useEffect(() => {
    const request = dispatch(getExoplanetFeed(id === undefined ? undefined : Number(id)));
    return () => request.abort();
  }, [dispatch, id, isAuthenticated]);

  if (!exoplanet) {
    return !isLoading && !error ? <p className="p-3">Экзопланеты не найдены.</p> : null;
  }

  const imageSrc = mediaUrl(exoplanet.image, '/DefaultImage.png');
  const videoSrc = mediaUrl(exoplanet.video, '/DefaultVideo.mp4');

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
    const currentIndex = catalog.findIndex((planet) => planet.id === exoplanet.id);
    const next = catalog[(currentIndex + 1) % catalog.length];
    if (next) navigate(`/feed/${next.id}`);
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

          {isAuthenticated && (
            <button
              type="button"
              className="feed-next-button feed-like-button"
              aria-label={exoplanet.likedInBrowser ? 'Снять лайк' : 'Поставить лайк'}
              aria-pressed={Boolean(exoplanet.likedInBrowser)}
              onClick={() => void dispatch(likeExoplanet({
                id: exoplanet.id,
                like: !exoplanet.likedInBrowser,
              }))}
            >
              <img src="/like.PNG" alt="" className="feed-icon" />
              <span>{exoplanet.likes_number ?? 0}</span>
            </button>
          )}

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

export default function FeedPage() {
  const { id } = useParams();
  return <ExoplanetFeed key={id ?? 'first'} id={id} />;
}