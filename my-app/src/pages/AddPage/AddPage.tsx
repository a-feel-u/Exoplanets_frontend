import { publicAsset } from '../../modules/runtime';
import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { mediaUrl } from '../../modules/media';
import { addDraftExoplanet, getDraftExoplanet, publishExoplanet, selectExoplanetsLoading } from '../../slices/exoplanetsSlice';
import type { Exoplanet } from '../../types/exoplanet';
import './PlanetForm.css';

function NewDraftForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectExoplanetsLoading);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoading && title.trim()) {
      void dispatch(addDraftExoplanet({ title: title.trim(), image, video }));
    }
  }

  return (
    <form className="planet-form" onSubmit={handleSubmit}>
      <label htmlFor="image">Фото:</label>
      <input id="image" type="file" accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(event) => setImage(event.target.files?.[0])} />
      <label htmlFor="video">Видео:</label>
      <input id="video" type="file" accept="video/mp4,video/webm,video/quicktime"
        onChange={(event) => setVideo(event.target.files?.[0])} />
      <label htmlFor="draft-title">Планета:</label>
      <input id="draft-title" required maxLength={30} placeholder="Введите название"
        value={title} onChange={(event) => setTitle(event.target.value)} />
      <button type="submit" disabled={isLoading}>Далее</button>
    </form>
  );
}

function PublishForm({ draft }: { draft: Exoplanet }) {
  const [distance, setDistance] = useState(String(draft.distance));
  const [weight, setWeight] = useState(String(draft.weight));
  const [description, setDescription] = useState(draft.description);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectExoplanetsLoading);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    const result = await dispatch(publishExoplanet({
      distance: Number(distance),
      weight: Number(weight),
      description,
    }));
    if (publishExoplanet.fulfilled.match(result)) {
      navigate(`/feed/${result.payload.id}`);
    }
  }

  return (
    <form className="planet-form" onSubmit={handleSubmit}>
      <div className="planet-previews">
        <div>
          <strong>Фото:</strong>
          <img src={mediaUrl(draft.image, '/DefaultImage.png')} alt="Фото экзопланеты" />
        </div>
        <div>
          <strong>Видео:</strong>
          <video src={mediaUrl(draft.video, '/DefaultVideo.mp4')}
            poster={draft.video ? undefined : publicAsset('base_video.PNG')} muted autoPlay loop playsInline />
        </div>
      </div>
      <label htmlFor="planet-title">Планета:</label>
      <input id="planet-title" value={draft.title} readOnly />
      <label htmlFor="distance">Расстояние до звезды (а. е.):</label>
      <input id="distance" type="number" min="0" step="1" required value={distance}
        onChange={(event) => setDistance(event.target.value)} />
      <label htmlFor="weight">Масса звезды (масс Солнца):</label>
      <input id="weight" type="number" min="0" max="9999.99" step="0.01" required value={weight}
        onChange={(event) => setWeight(event.target.value)} />
      <label htmlFor="description">Описание:</label>
      <textarea id="description" rows={3} maxLength={300} value={description}
        onChange={(event) => setDescription(event.target.value)} />
      <button type="submit" disabled={isLoading}>Добавить</button>
    </form>
  );
}

export default function AddPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const draft = useAppSelector((state) => state.exoplanets.draft);
  const [draftChecked, setDraftChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const request = dispatch(getDraftExoplanet());
    void request.then((result) => {
      if (getDraftExoplanet.fulfilled.match(result)) setDraftChecked(true);
    });
    return () => request.abort();
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/add' }} />;
  if (!draftChecked) return null;
  return draft ? <PublishForm key={draft.id} draft={draft} /> : <NewDraftForm />;
}
