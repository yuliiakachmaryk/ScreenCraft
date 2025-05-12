import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEpisodeById, updateEpisode, deleteEpisode } from '../../store/slices/episodeSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { DetailButton } from '../../components/HomeScreen/styles';

export const EpisodeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentItem: episode, loading, error } = useAppSelector((state) => state.episode);

  const [formData, setFormData] = useState({
    name: '',
    isExclusive: false,
    likesNumber: 0,
    reviewed: false,
    videoLink: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchEpisodeById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (episode) {
      setFormData({
        name: episode.name,
        isExclusive: episode.isExclusive,
        likesNumber: episode.likesNumber,
        reviewed: episode.reviewed,
        videoLink: episode.videoLink,
      });
    }
  }, [episode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await dispatch(updateEpisode({ id, data: formData })).unwrap();
        navigate('/episodes');
      } catch (err) {
        console.error('Failed to update episode:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this episode?')) {
      try {
        await dispatch(deleteEpisode(id)).unwrap();
        navigate('/episodes');
      } catch (err) {
        console.error('Failed to delete episode:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading episode..." />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!episode) {
    return <ErrorMessage>Episode not found</ErrorMessage>;
  }

  return (
    <PageContainer>
      <Header>
        <Title>Edit Episode</Title>
        <Subtitle>Update episode details or delete the episode</Subtitle>
      </Header>

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
          <Label htmlFor="videoLink">Video Link</Label>
          <Input
            type="url"
            id="videoLink"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleChange}
            required
            placeholder="https://example.com/video.mp4"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="likesNumber">Likes</Label>
          <Input
            type="number"
            id="likesNumber"
            name="likesNumber"
            value={formData.likesNumber}
            onChange={handleChange}
            min="0"
            required
          />
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
          <CheckboxContainer>
            <input
              type="checkbox"
              id="reviewed"
              name="reviewed"
              checked={formData.reviewed}
              onChange={handleChange}
            />
            <Label htmlFor="reviewed">Reviewed</Label>
          </CheckboxContainer>
        </FormGroup>

        <ButtonGroup>
          <DetailButton type="submit" $primary>
            Save Changes
          </DetailButton>
          <DetailButton type="button" onClick={() => navigate('/episodes')}>
            Cancel
          </DetailButton>
          <DetailButton type="button" onClick={handleDelete} $danger>
            Delete Episode
          </DetailButton>
        </ButtonGroup>
      </Form>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: Denike;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1.2rem;
  font-family: Denike;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-family: Denike;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
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
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  font-family: Denike;
  font-size: 1.2rem;
  margin-top: 2rem;
`; 