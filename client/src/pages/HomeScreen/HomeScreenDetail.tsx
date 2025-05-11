import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHomeScreenById,
  updateHomeScreen,
  deleteHomeScreen,
  addContentToSection,
  removeContentFromSection,
} from '../../store/slices/homeScreenSlice';
import { fetchContentItems, setPage, setItemsPerPage } from '../../store/slices/contentItemSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ContentSection } from '../../components/ContentSection/ContentSection';
import { ContentModal } from '../../components/HomeScreen/ContentModal';
import { ErrorMessage } from '../../components/HomeScreen/ErrorMessage';
import {
  DetailContainer,
  DetailHeader,
  DetailTitle,
  DetailActions,
  DetailStatus,
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

const SECTIONS = {
  RECOMMENDATIONS: 'recomendaciones',
  TOP_CHARTS: 'topCharts',
  MOST_TRENDING: 'mostTrending',
  MOST_POPULAR: 'mostPopular',
} as const;

export const HomeScreenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentItem: screen,
    loading,
    error: homeScreenError,
  } = useAppSelector((state) => state.homeScreen);
  const {
    items: contentItems,
    loading: contentItemsLoading,
    error: contentItemsError,
    total,
  } = useAppSelector((state) => state.contentItem);
  const [isEditing, setIsEditing] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [modalPage, setModalPage] = useState(1);
  const [modalItemsPerPage, setModalItemsPerPage] = useState(10);

  useEffect(() => {
    if (id) {
      dispatch(fetchHomeScreenById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (homeScreenError || contentItemsError) {
      setError(homeScreenError || contentItemsError);
    }
  }, [homeScreenError, contentItemsError]);

  const handleToggleActive = async () => {
    try {
      if (id) {
        await dispatch(
          updateHomeScreen({
            id,
            data: { isActive: !screen?.isActive },
          })
        ).unwrap();
        setError(null);
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await dispatch(deleteHomeScreen(id)).unwrap();
        navigate('/');
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleModalPageChange = (newPage: number) => {
    setModalPage(newPage);
    dispatch(setPage(newPage));
    dispatch(fetchContentItems({ page: newPage, limit: modalItemsPerPage }));
  };

  const handleModalItemsPerPageChange = (newLimit: number) => {
    setModalItemsPerPage(newLimit);
    setModalPage(1);
    dispatch(setItemsPerPage(newLimit));
    dispatch(setPage(1));
    dispatch(fetchContentItems({ page: 1, limit: newLimit }));
  };

  const handleAddContent = async (sectionName: string) => {
    try {
      setSelectedSection(sectionName);
      setModalPage(1);
      await dispatch(fetchContentItems({ page: 1, limit: modalItemsPerPage })).unwrap();
      setShowContentModal(true);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleContentSelect = async (contentId: string) => {
    try {
      if (id && selectedSection) {
        await dispatch(
          addContentToSection({
            id,
            contentId,
            section: selectedSection,
          })
        ).unwrap();
        setShowContentModal(false);
        setError(null);
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleRemoveContent = async (
    sectionName: string,
    contentId: string
  ) => {
    try {
      if (id) {
        await dispatch(
          removeContentFromSection({
            id,
            contentId,
            section: sectionName,
          })
        ).unwrap();
        setError(null);
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading home screen details..." />;
  }

  if (!screen) {
    return <DetailEmptyState>Home screen not found</DetailEmptyState>;
  }

  return (
    <DetailContainer>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <DetailHeader>
        <DetailTitle>Home Screen Details</DetailTitle>
        <DetailActions>
          <DetailStatus isActive={screen.isActive}>
            {screen.isActive ? 'Active' : 'Inactive'}
          </DetailStatus>
          {isEditing && (
            <DetailButton onClick={handleToggleActive}>
              {screen.isActive ? 'Deactivate' : 'Activate'}
            </DetailButton>
          )}
          <DetailButton onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </DetailButton>
          <DetailButton onClick={handleDelete} $danger>
            Delete
          </DetailButton>
        </DetailActions>
      </DetailHeader>
      <DetailSections>
        <ContentSection
          title="Recommendations"
          items={screen.recomendaciones}
          onAddContent={() => handleAddContent(SECTIONS.RECOMMENDATIONS)}
          onRemoveContent={(contentId) =>
            handleRemoveContent(SECTIONS.RECOMMENDATIONS, contentId)
          }
          isEditing={isEditing}
        />
        <ContentSection
          title="Top Charts"
          items={screen.topCharts}
          onAddContent={() => handleAddContent(SECTIONS.TOP_CHARTS)}
          onRemoveContent={(contentId) =>
            handleRemoveContent(SECTIONS.TOP_CHARTS, contentId)
          }
          isEditing={isEditing}
        />
        <ContentSection
          title="Most Trending"
          items={screen.mostTrending}
          onAddContent={() => handleAddContent(SECTIONS.MOST_TRENDING)}
          onRemoveContent={(contentId) =>
            handleRemoveContent(SECTIONS.MOST_TRENDING, contentId)
          }
          isEditing={isEditing}
        />
        <ContentSection
          title="Most Popular"
          items={screen.mostPopular}
          onAddContent={() => handleAddContent(SECTIONS.MOST_POPULAR)}
          onRemoveContent={(contentId) =>
            handleRemoveContent(SECTIONS.MOST_POPULAR, contentId)
          }
          isEditing={isEditing}
        />
      </DetailSections>

      {showContentModal && (
        <ContentModal
          contentItems={contentItems}
          loading={contentItemsLoading}
          onContentSelect={handleContentSelect}
          onClose={() => setShowContentModal(false)}
          currentPage={modalPage}
          itemsPerPage={modalItemsPerPage}
          total={total}
          onPageChange={handleModalPageChange}
          onItemsPerPageChange={handleModalItemsPerPageChange}
        />
      )}
    </DetailContainer>
  );
};
