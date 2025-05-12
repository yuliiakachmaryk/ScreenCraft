import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHomeScreenById,
  updateHomeScreen,
  deleteHomeScreen,
  addContentToSection,
  removeContentFromSection,
  setActive,
  addSection,
  updateSection,
  removeSection,
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
  DetailModal,
  DetailModalContent,
  DetailModalTitle,
  DetailCloseButton,
} from '../../components/HomeScreen/styles';
import { MobilePreviewModal } from '../../components/HomeScreen/MobilePreviewModal';
import { AddSectionModal } from '../../components/HomeScreen/AddSectionModal';

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
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const HomeScreenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedItem: homeScreen,
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

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
      if (homeScreen?.isActive) {
        await dispatch(updateHomeScreen({ 
          id: homeScreen._id, 
          data: { isActive: false } 
        })).unwrap();
      } else {
        await dispatch(setActive(homeScreen?._id || '')).unwrap();
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err as ErrorResponse);
      if (errorMessage.includes('409')) {
        setError('Another home screen is already active. Please deactivate it first before activating this one.');
      } else if (errorMessage.toLowerCase().includes('not found')) {
        setError('Home screen not found. It may have been deleted.');
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this home screen?')) {
      try {
        if (id) {
          await dispatch(deleteHomeScreen(id)).unwrap();
          navigate('/');
        }
      } catch (err) {
        setError(getErrorMessage(err as ErrorResponse));
      }
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
    setSelectedSection(sectionName);
    setShowContentModal(true);
    dispatch(fetchContentItems({ page: 1, limit: modalItemsPerPage }));
  };

  const handleContentSelect = async (contentId: string) => {
    try {
      if (id && selectedSection) {
        await dispatch(
          addContentToSection({
            id,
            contentItemId: contentId,
            section: selectedSection,
          })
        ).unwrap();
        setShowContentModal(false);
        setSelectedSection('');
        setError(null);
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleRemoveContent = async (sectionName: string, contentItemId: string) => {
    try {
      await dispatch(
        removeContentFromSection({
          id: homeScreen?._id || '',
          contentItemId,
          section: sectionName,
        })
      ).unwrap();
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleUpdateSection = async (sectionName: string, newOrder: number) => {
    try {
      if (id && homeScreen) {
        const currentSection = homeScreen.sections.find(s => s.name === sectionName);
        if (!currentSection) {
          throw new Error('Section not found');
        }

        const oldOrder = currentSection.order;
        await dispatch(
          updateSection({
            id,
            sectionName,
            sectionData: { 
              order: newOrder,
              items: currentSection.items
            },
          })
        ).unwrap();

        // Refresh the home screen data to get the updated order
        await dispatch(fetchHomeScreenById(id)).unwrap();
        setError(null);
      }
    } catch (err) {
      setError(getErrorMessage(err as ErrorResponse));
    }
  };

  const handleRemoveSection = async (sectionName: string) => {
    if (window.confirm(`Are you sure you want to remove the "${sectionName}" section?`)) {
      try {
        if (id) {
          await dispatch(
            removeSection({
              id,
              sectionName,
            })
          ).unwrap();
          setError(null);
        }
      } catch (err) {
        setError(getErrorMessage(err as ErrorResponse));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading home screen details..." />;
  }

  if (!homeScreen) {
    return <DetailEmptyState>Home screen not found</DetailEmptyState>;
  }

  return (
    <DetailContainer>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <DetailHeader>
        <DetailTitle>Home Screen Details</DetailTitle>
        <DetailActions>
          <DetailStatus isActive={homeScreen.isActive}>
            {homeScreen.isActive ? 'Active' : 'Inactive'}
          </DetailStatus>
          {isEditing && (
            <DetailButton onClick={handleToggleActive}>
              {homeScreen.isActive ? 'Deactivate' : 'Activate'}
            </DetailButton>
          )}
          <DetailButton onClick={() => setShowPreviewModal(true)}>
            Mobile Preview
          </DetailButton>
          <DetailButton onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </DetailButton>
          <DetailButton onClick={handleDelete} $danger>
            Delete
          </DetailButton>
        </DetailActions>
      </DetailHeader>
      <DetailSections>
        {isEditing && (
          <DetailButton onClick={() => setShowAddSectionModal(true)}>
            Add New Section
          </DetailButton>
        )}
        {[...homeScreen.sections]
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <ContentSection
              key={section.name}
              title={section.name}
              items={section.items}
              order={section.order}
              totalSections={homeScreen.sections.length}
              onAddContent={() => handleAddContent(section.name)}
              onRemoveContent={(contentId) =>
                handleRemoveContent(section.name, contentId)
              }
              onUpdateOrder={(newOrder) => handleUpdateSection(section.name, newOrder)}
              onDeleteSection={() => handleRemoveSection(section.name)}
              isEditing={isEditing}
            />
          ))}
      </DetailSections>

      {showContentModal && (
        <DetailModal onClick={() => setShowContentModal(false)}>
          <DetailModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DetailModalTitle>Add Content</DetailModalTitle>
            <DetailCloseButton onClick={() => setShowContentModal(false)}>&times;</DetailCloseButton>
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
          </DetailModalContent>
        </DetailModal>
      )}

      {showPreviewModal && (
        <MobilePreviewModal
          homeScreen={homeScreen}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {showAddSectionModal && (
        <DetailModal onClick={() => setShowAddSectionModal(false)}>
          <DetailModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DetailModalTitle>Add New Section</DetailModalTitle>
            <DetailCloseButton onClick={() => setShowAddSectionModal(false)}>&times;</DetailCloseButton>
            <AddSectionModal
              isOpen={showAddSectionModal}
              onClose={() => setShowAddSectionModal(false)}
              onAdd={async (section: { name: string; order: number; items: any[] }) => {
                try {
                  if (id) {
                    await dispatch(
                      addSection({
                        id,
                        section,
                      })
                    ).unwrap();
                    setShowAddSectionModal(false);
                    setError(null);
                  }
                } catch (err) {
                  setError(getErrorMessage(err as ErrorResponse));
                }
              }}
            />
          </DetailModalContent>
        </DetailModal>
      )}
    </DetailContainer>
  );
};
