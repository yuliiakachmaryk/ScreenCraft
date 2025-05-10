import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHomeScreens,
  createHomeScreen,
} from '../../store/slices/homeScreenSlice';
import { HomeScreen } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { HomeScreenCard } from '../../components/HomeScreenCard/HomeScreenCard';
import { CreateModal } from '../../components/HomeScreen/CreateModal';
import { DetailButton } from '../../components/HomeScreen/styles';

export const HomeScreenList = () => {
  const dispatch = useAppDispatch();
  const { items: homeScreens, loading } = useAppSelector(
    (state) => state.homeScreen
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeScreens());
  }, [dispatch]);

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
        homeScreens.map((screen: HomeScreen) => (
          <HomeScreenCard key={screen._id} screen={screen} />
        ))
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
