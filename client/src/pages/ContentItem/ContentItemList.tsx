import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchContentItems, createContentItem, setPage, setItemsPerPage } from '../../store/slices/contentItemSlice';
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
  const { 
    items: contentItems, 
    loading, 
    error: contentItemError,
    total,
    currentPage,
    itemsPerPage
  } = useAppSelector((state) => state.contentItem);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchContentItems({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (contentItemError) {
      setError(contentItemError);
    }
  }, [contentItemError]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setItemsPerPage(newLimit));
    dispatch(setPage(1));
  };

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
      dispatch(fetchContentItems({ page: currentPage, limit: itemsPerPage }));
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading content items..." />;
  }

  const totalPages = Math.ceil(total / itemsPerPage);

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
        <PageContainer>
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

          {contentItems.length > 0 && (
            <PaginationContainer>
              <PaginationInfo>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} content items
              </PaginationInfo>
              
              <PaginationControls>
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                <PageNumbers>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PageNumber
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PageNumber>
                  ))}
                </PageNumbers>
                
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </PaginationControls>
              
              <ItemsPerPageSelect
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </ItemsPerPageSelect>
            </PaginationContainer>
          )}
        </PageContainer>
      )}
    </DetailContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 200px);
`;

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

const PaginationContainer = styled.div`
  margin-top: auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaginationInfo = styled.div`
  color: #888;
  font-family: Denike;
  font-size: 0.9rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaginationButton = styled(DetailButton)`
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageNumber = styled.button<{ active: boolean }>`
  background: ${({ active }) => active ? '#ff6642' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: Denike;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => active ? '#ff6642' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ItemsPerPageSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.5rem;
  font-family: Denike;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }

  option {
    background: #2a2a2a;
  }
`;
