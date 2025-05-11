import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchContentItemById,
  updateContentItem,
  deleteContentItem,
} from '../../store/slices/contentItemSlice';
import { fetchEpisodes } from '../../store/slices/episodeSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/HomeScreen/ErrorMessage';
import { ContentItemForm } from '../../components/ContentItem/ContentItemForm';
import {
  DetailContainer,
  DetailHeader,
  DetailTitle,
  DetailActions,
  DetailButton,
  DetailSections,
  DetailEmptyState,
  DetailStatus,
} from '../../components/HomeScreen/styles';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const getErrorMessage = (error: ErrorResponse): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const ContentItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentItem: contentItem,
    loading: contentItemLoading,
    error: contentItemError,
  } = useAppSelector((state) => state.contentItem);
  const { items: episodes, loading: episodesLoading } = useAppSelector(
    (state) => state.episode
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (id) {
      dispatch(fetchContentItemById(id));
      dispatch(fetchEpisodes({ page: 1, limit: 50 }));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (contentItemError) {
      setError(contentItemError);
    }
  }, [contentItemError]);

  const handleUpdate = async (data: {
    name: string;
    introImage: string;
    isExclusive: boolean;
    category: string;
  }) => {
    try {
      if (id) {
        await dispatch(
          updateContentItem({
            id,
            data,
          })
        ).unwrap();
        setError(null);
        setIsEditing(false);
        fetchData();
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      try {
        if (id) {
          await dispatch(deleteContentItem(id)).unwrap();
          navigate('/content-items');
        }
      } catch (err) {
        setError(getErrorMessage(err as ErrorResponse));
      }
    }
  };

  if (contentItemLoading) {
    return <LoadingSpinner text="Loading content item details..." />;
  }

  if (!contentItem) {
    return <DetailEmptyState>Content item not found</DetailEmptyState>;
  }

  const availableEpisodes = episodes.filter(
    (episode) => !contentItem.episodes.some((e) => e._id === episode._id)
  );

  return (
    <DetailContainer>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <DetailHeader>
        <DetailTitle>Content Item Details</DetailTitle>
        <DetailActions>
          <DetailStatus isActive={contentItem.isExclusive}>
            {contentItem.isExclusive ? 'Exclusive' : 'Regular'}
          </DetailStatus>
          <DetailButton onClick={() => setIsEditing(!isEditing)} $primary>
            {isEditing ? 'Cancel' : 'Edit'}
          </DetailButton>
          <DetailButton onClick={handleDelete} $danger>
            Delete
          </DetailButton>
        </DetailActions>
      </DetailHeader>

      {isEditing ? (
        <ContentItemForm
          initialData={contentItem}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          onEpisodeChange={fetchData}
        />
      ) : (
        <>
          <DetailSections>
            <Section>
              <SectionTitle>Name</SectionTitle>
              <SectionContent>{contentItem.name}</SectionContent>
            </Section>
            <Section>
              <SectionTitle>Category</SectionTitle>
              <SectionContent>{contentItem.category}</SectionContent>
            </Section>
            <Section>
              <SectionTitle>Intro Image</SectionTitle>
              <ImagePreview
                src={`data:image/png;base64,${contentItem.introImage.replace(
                  /^data:image\/\w+;base64,/,
                  ''
                )}`}
                alt={contentItem.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Section>
          </DetailSections>

          <EpisodesContainer>
            <EpisodesSection>
              <SectionTitle>Current Episodes</SectionTitle>
              {contentItem.episodes.length > 0 ? (
                <EpisodesList>
                  {contentItem.episodes.map((episode) => (
                    <EpisodeItem key={episode._id}>
                      <EpisodeInfo>
                        <EpisodeName>{episode.name}</EpisodeName>
                        <EpisodeStatus isExclusive={episode.isExclusive}>
                          {episode.isExclusive ? 'Exclusive' : 'Regular'}
                        </EpisodeStatus>
                      </EpisodeInfo>
                    </EpisodeItem>
                  ))}
                </EpisodesList>
              ) : (
                <EmptyText>No episodes added yet</EmptyText>
              )}
            </EpisodesSection>

            <EpisodesSection>
              <SectionTitle>Available Episodes</SectionTitle>
              {episodesLoading ? (
                <LoadingSpinner text="Loading available episodes..." />
              ) : availableEpisodes.length > 0 ? (
                <EpisodesList>
                  {availableEpisodes.map((episode) => (
                    <EpisodeItem key={episode._id}>
                      <EpisodeInfo>
                        <EpisodeName>{episode.name}</EpisodeName>
                        <EpisodeStatus isExclusive={episode.isExclusive}>
                          {episode.isExclusive ? 'Exclusive' : 'Regular'}
                        </EpisodeStatus>
                      </EpisodeInfo>
                    </EpisodeItem>
                  ))}
                </EpisodesList>
              ) : (
                <EmptyText>No available episodes to add</EmptyText>
              )}
            </EpisodesSection>
          </EpisodesContainer>
        </>
      )}
    </DetailContainer>
  );
};

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h3`
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
`;

const SectionContent = styled.p`
  color: #ffffff;
  font-family: Denike;
  font-size: 1.2rem;
  margin: 0;
  text-shadow: -2px -2px 0 #ff6642, 2px -2px 0 #ff6642, -2px 2px 0 #ff6642,
    2px 2px 0 #ff6642;
`;

const ImagePreview = styled.img`
  width: auto;
  max-width: 400px;
  height: auto;
  max-height: 100px;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const EpisodesContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const EpisodesSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const EpisodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const EpisodeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EpisodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

const EpisodeName = styled.span`
  color: #ffffff;
  font-family: Denike;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EpisodeStatus = styled.span<{ isExclusive: boolean }>`
  color: ${({ isExclusive }) => (isExclusive ? '#ff6642' : '#dbdbdb')};
  font-family: Denike;
  font-size: 0.9rem;
`;

const EmptyText = styled.p`
  color: #666;
  font-family: Denike;
  font-size: 1rem;
  margin: 1rem 0;
  text-align: center;
`;
