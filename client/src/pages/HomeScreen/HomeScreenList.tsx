import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHomeScreens,
  createHomeScreen,
  setPage,
  setLimit,
} from '../../store/slices/homeScreenSlice';
import { HomeScreen } from '../../types/homeScreen';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { HomeScreenCard } from '../../components/HomeScreenCard/HomeScreenCard';
import { CreateModal } from '../../components/HomeScreen/CreateModal';
import {
  Container,
  Header,
  Title,
  DetailButton,
  Content,
  EmptyState,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  ItemsPerPageSelect,
  PageNumbers,
  PageNumber,
} from '../../components/HomeScreen/styles';

export const HomeScreenList = () => {
  const dispatch = useAppDispatch();
  const { items: homeScreens, loading, total, page, limit } = useAppSelector(
    (state) => state.homeScreen
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeScreens({ page, limit }));
  }, [dispatch, page, limit]);

  const handleCreateHomeScreen = async (data: Partial<HomeScreen>) => {
    try {
      await dispatch(createHomeScreen(data)).unwrap();
      setShowCreateModal(false);
      dispatch(fetchHomeScreens({ page, limit }));
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

      <Content>
        {homeScreens && homeScreens.length > 0 ? (
          <>
            {homeScreens.map((screen) => (
              <HomeScreenCard key={screen._id} screen={screen} />
            ))}
            <PaginationContainer>
              <PaginationInfo>
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} items
              </PaginationInfo>
              <PaginationControls>
                <DetailButton
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </DetailButton>
                <PageNumbers>
                  {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((pageNum) => (
                    <PageNumber
                      key={pageNum}
                      active={pageNum === page}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PageNumber>
                  ))}
                </PageNumbers>
                <DetailButton
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page * limit >= total}
                >
                  Next
                </DetailButton>
              </PaginationControls>
              <ItemsPerPageSelect
                value={limit}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </ItemsPerPageSelect>
            </PaginationContainer>
          </>
        ) : (
          <EmptyState>No home screens found</EmptyState>
        )}
      </Content>

      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => handleCreateHomeScreen({})}
        />
      )}
    </Container>
  );
};
