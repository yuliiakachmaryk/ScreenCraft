import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchContentItems, createContentItem } from '../../store/slices/contentItemSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ContentItemCard } from '../../components/ContentItemCard/ContentItemCard';
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

export const ContentItemList = () => {
  const dispatch = useAppDispatch();
  const { items: contentItems, loading, error: contentItemError } = useAppSelector((state) => state.contentItem);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchContentItems());
  }, [dispatch]);

  useEffect(() => {
    if (contentItemError) {
      setError(contentItemError);
    }
  }, [contentItemError]);

  const handleCreate = async (data: {
    name: string;
    introImage: string;
    isExclusive: boolean;
    category: string;
  }) => {
    try {
      await dispatch(createContentItem(data)).unwrap();
      setError(null);
      setIsCreating(false);
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading content items..." />;
  }

  return (
    <DetailContainer>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <DetailHeader>
        <DetailTitle>Content Library</DetailTitle>
        <DetailActions>
          <DetailButton onClick={() => setIsCreating(!isCreating)} $primary>
            {isCreating ? 'Cancel' : 'Add New Content'}
          </DetailButton>
        </DetailActions>
      </DetailHeader>

      {isCreating ? (
        <ContentItemForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <DetailSections>
          {contentItems.length === 0 ? (
            <DetailEmptyState>
              <div>📺</div>
              <h2>No content items available</h2>
              <p>Add new content to get started</p>
            </DetailEmptyState>
          ) : (
            <CardContainer>
              {contentItems.map((item) => (
                <ContentItemCard key={item._id} item={item} />
              ))}
            </CardContainer>
          )}
        </DetailSections>
      )}
    </DetailContainer>
  );
};

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;
