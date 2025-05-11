import styled from 'styled-components';
import { ContentItem } from '../../types';

interface ContentSectionProps {
  title: string;
  items?: ContentItem[];
  isEditing?: boolean;
  onAddContent?: () => void;
  onRemoveContent?: (contentId: string) => void;
  size?: number;
}

export const ContentSection = ({ 
  title, 
  items, 
  isEditing,
  onAddContent,
  onRemoveContent,
  size = 3
}: ContentSectionProps) => {
  const displayItems = items?.slice(0, size);

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {isEditing && (
          <AddButton onClick={onAddContent}>
            Add Content
          </AddButton>
        )}
      </SectionHeader>
      {displayItems?.map((item) => (
        <ContentItemCard key={item._id}>
          {item.name}
          {isEditing && (
            <RemoveButton onClick={() => onRemoveContent?.(item._id)}>
              Remove
            </RemoveButton>
          )}
        </ContentItemCard>
      ))}
    </Section>
  );
};

const Section = styled.div`
  background-color: #242424;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #333;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ff6642;
  padding-bottom: 0.5rem;
`;

const SectionTitle = styled.h4`
  color: #dbdbdb;
  font-size: 1.2rem;
  margin: 0;

  font-family: Denike;
`;

const ContentItemCard = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  color: #dbdbdb;
  transition: background-color 0.2s;
  font-family: Denike;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #444;
  }
`;

const AddButton = styled.button`
  background-color: transparent;
  border: 1px solid #ff6642;
  color: #ff6642;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: Denike;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff6642;
    color: #fff;
  }
`;

const RemoveButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-family: Denike;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background: #ff6666;
  }
`;
