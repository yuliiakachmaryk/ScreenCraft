import {
  DetailModal,
  DetailModalContent,
  DetailModalTitle,
  DetailButton,
} from './styles';

interface CreateModalProps {
  onCreate: () => void;
  onClose: () => void;
}

export const CreateModal = ({ onCreate, onClose }: CreateModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <DetailModal onClick={handleBackdropClick}>
      <DetailModalContent>
        <DetailModalTitle>Create new empty Home Screen</DetailModalTitle>
        <DetailButton onClick={onCreate} $primary style={{ marginTop: '1rem' }}>
          Create
        </DetailButton>
        <DetailButton
          onClick={onClose}
          style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          Cancel
        </DetailButton>
      </DetailModalContent>
    </DetailModal>
  );
};
