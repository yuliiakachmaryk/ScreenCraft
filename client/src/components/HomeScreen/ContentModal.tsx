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

interface ContentModalProps {
  contentItems: ContentItem[];
  loading: boolean;
  onContentSelect: (contentId: string) => void;
  onClose: () => void;
}

export const ContentModal = ({
  contentItems,
  loading,
  onContentSelect,
  onClose,
}: ContentModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <DetailModal onClick={handleBackdropClick}>
      <DetailModalContent>
        <DetailModalTitle>Select Content to Add</DetailModalTitle>
        {loading ? (
          <LoadingSpinner text="Loading content items..." />
        ) : (
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
        )}
        <DetailButton onClick={onClose} style={{ marginTop: '1rem' }}>
          Cancel
        </DetailButton>
      </DetailModalContent>
    </DetailModal>
  );
};
