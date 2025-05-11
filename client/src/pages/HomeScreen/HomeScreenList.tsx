import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHomeScreens,
  createHomeScreen,
  setPage,
  setLimit,
} from '../../store/slices/homeScreenSlice';
import { HomeScreen } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { HomeScreenCard } from '../../components/HomeScreenCard/HomeScreenCard';
import { CreateModal } from '../../components/HomeScreen/CreateModal';
import { DetailButton } from '../../components/HomeScreen/styles';

export const HomeScreenList = () => {
  const dispatch = useAppDispatch();
  const { items: homeScreens, loading, pagination } = useAppSelector(
    (state) => state.homeScreen
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeScreens({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleCreate = async () => {
    try {
      await dispatch(
        createHomeScreen({
          isActive: false,
          recomendaciones: [],
          topCharts: [],
          mostTrending: [],
          mostPopular: [],
        })
      ).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create home screen:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
  };

  if (loading) {
    return <LoadingSpinner text="Loading home screens..." />;
  }

  return (
    <Container>
      <Header>
        <Title>Home Screens</Title>
        <DetailButton onClick={() => setShowCreateModal(true)} $primary>
          Create New Screen
        </DetailButton>
      </Header>
      {homeScreens && homeScreens.length > 0 ? (
        <>
          {homeScreens.map((screen: HomeScreen) => (
            <HomeScreenCard key={screen._id} screen={screen} />
          ))}
          <PaginationContainer>
            <PaginationInfo>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} home screens
            </PaginationInfo>
            
            <PaginationControls>
              <DetailButton 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </DetailButton>
              
              <PageNumber active={true}>
                Page {pagination.page} of {pagination.totalPages}
              </PageNumber>
              
              <DetailButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </DetailButton>
            </PaginationControls>
            
            <ItemsPerPageSelect
              value={pagination.limit}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </ItemsPerPageSelect>
          </PaginationContainer>
        </>
      ) : (
        <EmptyState>No home screens available</EmptyState>
      )}

      {showCreateModal && (
        <CreateModal
          onCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #dbdbdb;
  font-size: 2.5rem;
  font-family: Denike;
`;

const EmptyState = styled.div`
  color: #666;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PaginationInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PageNumber = styled.div<{ active: boolean }>`
  color: ${props => props.active ? '#dbdbdb' : '#666'};
  font-size: 1rem;
`;

const ItemsPerPageSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #dbdbdb;
  border: 1px solid #444;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
  
  option {
    background-color: #2a2a2a;
  }
`;
