import React from 'react';
import styled from 'styled-components';
import type { ContentItem } from '../../types';

const Section = styled.div`
  margin-bottom: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
`;

const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #0056b3;
  }
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyMessage = styled.p`
  color: #666;
  text-align: center;
  margin: 1rem 0;
`;

const ContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 4px;
`;

const ContentItemTitle = styled.span`
  color: #fff;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background: #c82333;
  }
`;

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onAddContent: () => void;
  onRemoveContent: (contentItemId: string) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  items,
  onAddContent,
  onRemoveContent,
}) => {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <AddButton onClick={onAddContent}>Add Content</AddButton>
      </SectionHeader>
      <SectionContent>
        {items.length === 0 ? (
          <EmptyMessage>No content items added yet</EmptyMessage>
        ) : (
          items.map((item) => (
            <ContentItem key={item._id}>
              <ContentItemTitle>{item.name}</ContentItemTitle>
              <RemoveButton onClick={() => onRemoveContent(item._id)}>
                Remove
              </RemoveButton>
            </ContentItem>
          ))
        )}
      </SectionContent>
    </Section>
  );
}; 