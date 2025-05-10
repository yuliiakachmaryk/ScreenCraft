import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DetailButton } from '../HomeScreen/styles';
import { EpisodeModal } from './EpisodeModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEpisodes } from '../../store/slices/episodeSlice';
import { addEpisodeToContentItem, removeEpisodeFromContentItem } from '../../store/slices/contentItemSlice';
import type { Episode } from '../../types';

interface ContentItemFormProps {
  initialData?: {
    _id: string;
    name: string;
    introImage: string;
    isExclusive: boolean;
    category: string;
    episodes: Episode[];
  };
  onSubmit: (data: {
    name: string;
    introImage: string;
    isExclusive: boolean;
    category: string;
  }) => void;
  onCancel: () => void;
  onEpisodeChange?: () => void;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const ContentItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  onEpisodeChange,
}: ContentItemFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    introImage: '',
    isExclusive: false,
    category: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    items: episodes,
    loading: episodesLoading,
  } = useAppSelector((state) => state.episode);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        introImage: initialData.introImage,
        isExclusive: initialData.isExclusive,
        category: initialData.category,
      });
      setPreviewImage(initialData.introImage);
    }
    dispatch(fetchEpisodes());
  }, [initialData, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({
          ...prev,
          introImage: compressedBase64
        }));
        setPreviewImage(compressedBase64);
      } catch (error) {
        console.error('Error compressing image:', error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddEpisode = async (episodeId: string) => {
    try {
      if (initialData?._id) {
        await dispatch(
          addEpisodeToContentItem({
            id: initialData._id,
            episodeId,
          })
        ).unwrap();
        setError(null);
        setIsEpisodeModalOpen(false);
        onEpisodeChange?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add episode');
    }
  };

  const handleRemoveEpisode = async (episodeId: string) => {
    if (window.confirm('Are you sure you want to remove this episode?')) {
      try {
        if (initialData?._id) {
          await dispatch(
            removeEpisodeFromContentItem({
              id: initialData._id,
              episodeId,
            })
          ).unwrap();
          setError(null);
          onEpisodeChange?.();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove episode');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="documentary">Documentary</option>
          <option value="show">Show</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="introImage">Intro Image</Label>
        <FileInput
          type="file"
          id="introImage"
          name="introImage"
          accept="image/*"
          onChange={handleImageChange}
          required={!initialData}
          disabled={isCompressing}
        />
        {isCompressing && <CompressingText>Compressing image...</CompressingText>}
        {previewImage && !isCompressing && (
          <ImagePreview src={previewImage} alt="Preview" />
        )}
      </FormGroup>

      <FormGroup>
        <CheckboxContainer>
          <input
            type="checkbox"
            id="isExclusive"
            name="isExclusive"
            checked={formData.isExclusive}
            onChange={handleChange}
          />
          <Label htmlFor="isExclusive">Exclusive Content</Label>
        </CheckboxContainer>
      </FormGroup>

      <FormGroup>
        <SectionHeader>
          <Label>Episodes</Label>
          <DetailButton
            type="button"
            onClick={() => setIsEpisodeModalOpen(true)}
            $primary
          >
            Add Episode
          </DetailButton>
        </SectionHeader>
        <EpisodesList>
          {initialData?.episodes.map((episode) => (
            <EpisodeItem key={episode._id}>
              <EpisodeInfo>
                <EpisodeName>{episode.name}</EpisodeName>
                <EpisodeStatus isExclusive={episode.isExclusive}>
                  {episode.isExclusive ? 'Exclusive' : 'Regular'}
                </EpisodeStatus>
              </EpisodeInfo>
              <EpisodeActions>
                <DetailButton
                  type="button"
                  onClick={() => handleRemoveEpisode(episode._id)}
                  $danger
                >
                  Remove
                </DetailButton>
              </EpisodeActions>
            </EpisodeItem>
          ))}
        </EpisodesList>
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <DetailButton type="submit" $primary>
          {initialData ? 'Save Changes' : 'Create Content'}
        </DetailButton>
        <DetailButton type="button" onClick={onCancel}>
          Cancel
        </DetailButton>
      </ButtonGroup>

      {isEpisodeModalOpen && (
        <EpisodeModal
          episodes={episodes.filter(
            (episode) =>
              !initialData?.episodes.some((e) => e._id === episode._id)
          )}
          loading={episodesLoading}
          onEpisodeSelect={handleAddEpisode}
          onClose={() => setIsEpisodeModalOpen(false)}
        />
      )}
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::-webkit-file-upload-button {
    background: #ff6642;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: Denike;
    margin-right: 1rem;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &:focus {
    outline: none;
    border-color: #ff6642;
  }
`;

const CompressingText = styled.p`
  color: #dbdbdb;
  font-family: Denike;
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 1rem;
  object-fit: contain;
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EpisodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const EpisodeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
`;

const EpisodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EpisodeName = styled.span`
  color: #ffffff;
  font-family: Denike;
  font-size: 1rem;
`;

const EpisodeStatus = styled.span<{ isExclusive: boolean }>`
  color: ${({ isExclusive }) => (isExclusive ? '#ff6642' : '#dbdbdb')};
  font-family: Denike;
  font-size: 0.9rem;
`;

const EpisodeActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: Denike;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`; 