import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DetailButton } from '../HomeScreen/styles';
import { Episode } from '../../types';

interface EpisodeFormProps {
  initialData?: Episode;
  onSubmit: (data: {
    name: string;
    isExclusive: boolean;
    likesNumber: number;
    reviewed: boolean;
    videoLink: string;
  }) => void;
  onCancel: () => void;
}

export const EpisodeForm = ({
  initialData,
  onSubmit,
  onCancel,
}: EpisodeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    isExclusive: false,
    likesNumber: 0,
    reviewed: false,
    videoLink: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        isExclusive: initialData.isExclusive,
        likesNumber: initialData.likesNumber,
        reviewed: initialData.reviewed,
        videoLink: initialData.videoLink,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="videoLink">Video Link</Label>
        <Input
          type="url"
          id="videoLink"
          name="videoLink"
          value={formData.videoLink}
          onChange={handleChange}
          required
          placeholder="https://example.com/video.mp4"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="likesNumber">Likes</Label>
        <Input
          type="number"
          id="likesNumber"
          name="likesNumber"
          value={formData.likesNumber}
          onChange={handleChange}
          min="0"
          required
        />
      </FormGroup>

      <FormGroup>
        <CheckboxContainer>
          <input
            type="checkbox"
            id="isExclusive"
            name="isExclusive"
            checked={formData.isExclusive}
            onChange={handleChange}
          />
          <Label htmlFor="isExclusive">Exclusive Content</Label>
        </CheckboxContainer>
      </FormGroup>

      <FormGroup>
        <CheckboxContainer>
          <input
            type="checkbox"
            id="reviewed"
            name="reviewed"
            checked={formData.reviewed}
            onChange={handleChange}
          />
          <Label htmlFor="reviewed">Reviewed</Label>
        </CheckboxContainer>
      </FormGroup>

      <ButtonGroup>
        <DetailButton type="submit" $primary>
          {initialData ? 'Save Changes' : 'Create Episode'}
        </DetailButton>
        <DetailButton type="button" onClick={onCancel}>
          OK
        </DetailButton>
      </ButtonGroup>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6642;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`; 