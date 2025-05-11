import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DetailButton } from './styles';
import {
  DetailModal,
  DetailModalContent,
  DetailModalTitle,
  DetailContentList,
  DetailContentItem,
  DetailContentItemInfo,
  DetailContentItemName,
  DetailContentItemCategory,
  DetailContentItemExclusive,
} from './styles';
import type { ContentItem } from '../../types';
import styled from 'styled-components';

interface ContentModalProps {
  contentItems: ContentItem[];
  loading: boolean;
  onContentSelect: (contentId: string) => void;
  onClose: () => void;
  currentPage: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export const ContentModal = ({
  contentItems,
  loading,
  onContentSelect,
  onClose,
  currentPage,
  itemsPerPage,
  total,
  onPageChange,
  onItemsPerPageChange,
}: ContentModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <DetailModal onClick={handleBackdropClick}>
      <DetailModalContent>
        <DetailModalTitle>Select Content to Add</DetailModalTitle>
        {loading ? (
          <LoadingSpinner text="Loading content items..." />
        ) : (
          <>
            <DetailContentList>
              {contentItems.map((content: ContentItem) => (
                <DetailContentItem
                  key={content._id}
                  onClick={() => onContentSelect(content._id)}>
                  <DetailContentItemInfo>
                    <DetailContentItemName>{content.name}</DetailContentItemName>
                    <DetailContentItemCategory>
                      {content.category}
                    </DetailContentItemCategory>
                    <DetailContentItemExclusive isExclusive={content.isExclusive}>
                      {content.isExclusive ? 'Exclusive' : 'Regular'}
                    </DetailContentItemExclusive>
                  </DetailContentItemInfo>
                </DetailContentItem>
              ))}
            </DetailContentList>

            <PaginationContainer>
              <PaginationInfo>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} content items
              </PaginationInfo>
              
              <PaginationControls>
                <DetailButton 
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </DetailButton>
                
                <PageNumber active={true}>
                  Page {currentPage} of {totalPages}
                </PageNumber>
                
                <DetailButton
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </DetailButton>
              </PaginationControls>
              
              <ItemsPerPageSelect
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </ItemsPerPageSelect>
            </PaginationContainer>
          </>
        )}
        <DetailButton onClick={onClose} style={{ marginTop: '1rem' }}>
          Cancel
        </DetailButton>
      </DetailModalContent>
    </DetailModal>
  );
};

const PaginationContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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

const PageNumber = styled.div<{ active: boolean }>`
  background: ${({ active }) => active ? '#ff6642' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: Denike;
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
