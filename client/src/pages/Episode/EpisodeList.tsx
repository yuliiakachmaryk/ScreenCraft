import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEpisodes, setPage, setItemsPerPage, createEpisode } from '../../store/slices/episodeSlice';
import { Episode } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { EpisodeCard } from '../../components/EpisodeCard/EpisodeCard';
import { DetailButton } from '../../components/HomeScreen/styles';
import { EpisodeForm } from '../../components/Episode/EpisodeForm';

export const EpisodeList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const { 
    items: episodes, 
    loading, 
    total, 
    currentPage, 
    itemsPerPage 
  } = useAppSelector((state) => state.episode);

  useEffect(() => {
    dispatch(fetchEpisodes({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setItemsPerPage(newLimit));
    dispatch(setPage(1));
  };

  const handleCreateEpisode = async (data: {
    name: string;
    isExclusive: boolean;
    likesNumber: number;
    reviewed: boolean;
    videoLink: string;
  }) => {
    try {
      await dispatch(createEpisode(data)).unwrap();
      setIsCreating(false);
      dispatch(fetchEpisodes({ page: currentPage, limit: itemsPerPage }));
    } catch (error) {
      console.error('Failed to create episode:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading episodes..." />;
  }

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <PageContainer>
      <Header>
        <Title>Episodes</Title>
        <Subtitle>Browse and manage your episode collection</Subtitle>
        <DetailButton onClick={() => setIsCreating(true)} $primary>
          Create New Episode
        </DetailButton>
      </Header>
      
      <ContentSection>
        {isCreating ? (
          <EpisodeForm
            onSubmit={handleCreateEpisode}
            onCancel={() => setIsCreating(false)}
          />
        ) : episodes && episodes.length > 0 ? (
          <>
            <CardContainer>
              {episodes.map((episode: Episode) => (
                <EpisodeCardWrapper key={episode._id}>
                  <EpisodeCard episode={episode} />
                  <DetailButton onClick={() => navigate(`/episodes/${episode._id}`)}>
                    Edit Episode
                  </DetailButton>
                </EpisodeCardWrapper>
              ))}
            </CardContainer>
            
            <PaginationContainer>
              <PaginationInfo>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} episodes
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
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🎬</EmptyStateIcon>
            <EmptyStateText>No episodes available</EmptyStateText>
            <EmptyStateSubtext>Add new episodes to get started</EmptyStateSubtext>
          </EmptyState>
        )}
      </ContentSection>
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

const ContentSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin: 2rem auto;
  max-width: 500px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-family: Denike;
`;

const EmptyStateSubtext = styled.p`
  color: #888;
  font-size: 1.1rem;
  font-family: Denike;
`;

const EpisodeCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
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