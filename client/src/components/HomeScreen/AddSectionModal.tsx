import { useState } from 'react';
import styled from 'styled-components';
import { DetailButton } from './styles';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (section: { name: string; order: number; items: any[] }) => void;
}

export const AddSectionModal = ({ isOpen, onClose, onAdd }: AddSectionModalProps) => {
  const [sectionName, setSectionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionName.trim()) {
      onAdd({
        name: sectionName.trim(),
        order: 0,
        items: [],
      });
      setSectionName('');
    }
  };

  if (!isOpen) return null;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="sectionName">Section Name</Label>
        <Input
          id="sectionName"
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Enter section name"
          required
        />
      </FormGroup>
      <ButtonGroup>
        <DetailButton type="submit">Add Section</DetailButton>
        <DetailButton type="button" onClick={onClose}>
          OK
        </DetailButton>
      </ButtonGroup>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #fff;
  font-family: Denike;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6642;
    box-shadow: 0 0 0 2px rgba(255, 102, 66, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`; 