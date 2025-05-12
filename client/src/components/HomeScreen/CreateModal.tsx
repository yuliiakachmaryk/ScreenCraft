import { useState } from 'react';
import styled from 'styled-components';

interface CreateModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; sections: { name: string; order: number }[] }) => void;
}

export const CreateModal = ({ onClose, onCreate }: CreateModalProps) => {
  const [sections, setSections] = useState<{ name: string; order: number }[]>([
    { name: '', order: 0 }
  ]);

  const handleAddSection = () => {
    setSections([...sections, { name: '', order: sections.length }]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections.map((section, i) => ({ ...section, order: i })));
  };

  const handleSectionNameChange = (index: number, name: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], name };
    setSections(newSections);
  };

  const handleSectionOrderChange = (index: number, order: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], order };
    newSections.sort((a, b) => a.order - b.order);
    setSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sections.some(section => !section.name)) {
      alert('Please fill in all section names');
      return;
    }
    onCreate({ name: 'New Home Screen', sections });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Home Screen</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <SectionList>
            {sections.map((section, index) => (
              <SectionItem key={index}>
                <OrderInput
                  type="number"
                  min="0"
                  value={section.order}
                  onChange={(e) => handleSectionOrderChange(index, parseInt(e.target.value) || 0)}
                />
                <SectionInput
                  type="text"
                  placeholder="Section name"
                  value={section.name}
                  onChange={(e) => handleSectionNameChange(index, e.target.value)}
                />
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveSection(index)}
                  disabled={sections.length === 1}
                >
                  Remove
                </RemoveButton>
              </SectionItem>
            ))}
          </SectionList>
          <AddSectionButton type="button" onClick={handleAddSection}>
            Add Section
          </AddSectionButton>
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">Create</SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  border: 1px solid #333;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  font-family: Denike;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: #fff;
  }
`;

const SectionList = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const OrderInput = styled.input`
  width: 80px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.75rem;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SectionInput = styled.input`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.75rem;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: 1px solid #ff4d26;
  color: #ff4d26;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #ff4d26;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddSectionButton = styled.button`
  background-color: transparent;
  border: 1px solid #ff6642;
  color: #ff6642;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: #ff6642;
    color: #fff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background-color: transparent;
  border: 1px solid #666;
  color: #666;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #fff;
    color: #fff;
  }
`;

const SubmitButton = styled.button`
  background-color: #ff6642;
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff4d26;
  }
`;
