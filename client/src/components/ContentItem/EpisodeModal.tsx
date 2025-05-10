import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DetailButton } from '../HomeScreen/styles';
import {
  DetailModal,
  DetailModalContent,
  DetailModalTitle,
  DetailContentList,
  DetailContentItem,
  DetailContentItemInfo,
  DetailContentItemName,
  DetailContentItemExclusive,
} from '../HomeScreen/styles';
import type { Episode } from '../../types';

interface EpisodeModalProps {
  episodes: Episode[];
  loading: boolean;
  onEpisodeSelect: (episodeId: string) => void;
  onClose: () => void;
}

export const EpisodeModal = ({
  episodes,
  loading,
  onEpisodeSelect,
  onClose,
}: EpisodeModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <DetailModal onClick={handleBackdropClick}>
      <DetailModalContent>
        <DetailModalTitle>Select Episode to Add</DetailModalTitle>
        {loading ? (
          <LoadingSpinner text="Loading episodes..." />
        ) : (
          <DetailContentList>
            {episodes.map((episode: Episode) => (
              <DetailContentItem
                key={episode._id}
                onClick={() => onEpisodeSelect(episode._id)}>
                <DetailContentItemInfo>
                  <DetailContentItemName>{episode.name}</DetailContentItemName>
                  <DetailContentItemExclusive isExclusive={episode.isExclusive}>
                    {episode.isExclusive ? 'Exclusive' : 'Regular'}
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