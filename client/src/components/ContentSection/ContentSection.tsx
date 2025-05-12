import styled from 'styled-components';

import { DetailButton } from '../HomeScreen/styles';

interface ContentSectionProps {
  title: string;
  items: any[];
  order: number;
  totalSections: number;
  onAddContent?: () => void;
  onRemoveContent?: (itemId: string) => void;
  onUpdateOrder?: (newOrder: number) => void;
  onDeleteSection?: () => void;
  isEditing?: boolean;
}

export const ContentSection = ({
  title,
  items,
  order,
  totalSections,
  onAddContent,
  onRemoveContent,
  onUpdateOrder,
  onDeleteSection,
  isEditing,
}: ContentSectionProps) => {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <Title>{title}</Title>
          {isEditing && (
            <OrderControls>
              <OrderButton
                onClick={() => onUpdateOrder?.(order - 1)}
                disabled={order === 0}
                title="Move up">
                ↑
            </OrderButton>
            <OrderButton
              onClick={() => onUpdateOrder?.(order + 1)}
              disabled={order === totalSections - 1}
              title="Move down">
              ↓
            </OrderButton>
            <DeleteButton onClick={onDeleteSection} title="Delete section">
              ×
              </DeleteButton>
            </OrderControls>
          )}
        </SectionTitle>
        {onAddContent && (
          <DetailButton onClick={onAddContent}>Add Content</DetailButton>
        )}
      </SectionHeader>
      <ItemsList>
        {items.map((item) => (
          <Item key={item._id}>
            <ItemContent>{item.title || item.name}</ItemContent>
            {isEditing && onRemoveContent && (
              <RemoveButton
                onClick={() => onRemoveContent(item._id)}
                title="Remove">
                ×
              </RemoveButton>
            )}
          </Item>
        ))}
        {items.length === 0 && (
          <EmptyState>No content items in this section</EmptyState>
        )}
      </ItemsList>
    </Section>
  );
};

const Section = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #ff6642;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
  font-family: Denike;
  letter-spacing: 0.5px;
`;

const OrderControls = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const OrderButton = styled.button`
  background: none;
  border: 1px solid #333;
  color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #ff6642;
    color: #ff6642;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-left: 8px;

  &:hover {
    background-color: rgba(255, 68, 68, 0.1);
    transform: scale(1.05);
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 50px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #fff;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #ff6642;
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: #ff6642;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  font-family: Denike;
  font-size: 1rem;
  color: #dbdbdb;
  letter-spacing: 0.3px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    color: #ff6642;
    transform: scale(1.1);
    background-color: rgba(255, 102, 66, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  color: #666;
  text-align: center;
  padding: 20px;
  font-family: Denike;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px dashed #333;
`;
