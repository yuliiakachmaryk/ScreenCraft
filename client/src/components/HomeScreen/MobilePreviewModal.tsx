import styled from 'styled-components';
import { HomeScreen } from '../../store/slices/homeScreenSlice';
import {
  DetailModal,
  DetailModalContent,
  DetailModalTitle,
  DetailCloseButton,
} from '../../components/HomeScreen/styles';

interface MobilePreviewModalProps {
  homeScreen: HomeScreen;
  onClose: () => void;
}

const PreviewContainer = styled.div`
  max-width: 375px;
  margin: 0 auto;
  background-color: #1a1a1a;
  min-height: 667px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid #333;
`;

const Section = styled.div`
  margin-bottom: 24px;
  padding: 0 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #fff;
  font-family: Denike;
`;

const ItemsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ff6642;
    border-radius: 2px;
  }
`;

const ItemCard = styled.div`
  min-width: 150px;
  max-width: 150px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 6px;
  color: #fff;
  border: 1px solid #333;
  transition: all 0.2s;

  &:hover {
    border-color: #ff6642;
  }
`;

export const MobilePreviewModal = ({ homeScreen, onClose }: MobilePreviewModalProps) => {
  return (
    <DetailModal onClick={onClose}>
      <DetailModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <DetailModalTitle>Mobile Preview</DetailModalTitle>
        <DetailCloseButton onClick={onClose}>&times;</DetailCloseButton>
        <PreviewContainer>
          {[...homeScreen.sections]
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <Section key={section.name}>
                <SectionTitle>{section.name}</SectionTitle>
                <ItemsContainer>
                  {section.items.map((item) => (
                    <ItemCard key={item._id}>
                      {item.title || item.name}
                    </ItemCard>
                  ))}
                </ItemsContainer>
              </Section>
            ))}
        </PreviewContainer>
      </DetailModalContent>
    </DetailModal>
  );
}; 