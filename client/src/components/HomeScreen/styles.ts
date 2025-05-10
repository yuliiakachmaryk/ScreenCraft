import styled from 'styled-components';

export const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const DetailTitle = styled.h1`
  color: #dbdbdb;
  font-size: 2.5rem;
  font-family: Denike;
`;

export const DetailActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const DetailStatus = styled.h3<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? '#ff6642' : '#666')};
  font-size: 1.5rem;
  font-family: Denike;
  margin: 0;
`;

export interface ButtonProps {
  $primary?: boolean;
  $danger?: boolean;
}

export const DetailButton = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid
    ${(props) =>
      props.$danger ? '#ff4444' : props.$primary ? '#ff6642' : '#666'};
  background-color: ${(props) =>
    props.$danger ? 'transparent' : props.$primary ? '#ff6642' : 'transparent'};
  color: ${(props) =>
    props.$danger ? '#ff4444' : props.$primary ? '#fff' : '#666'};
  font-family: Denike;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$danger ? '#ff4444' : props.$primary ? '#ff6642' : '#333'};
    color: ${(props) => (props.$danger || props.$primary ? '#fff' : '#dbdbdb')};
  }
`;

export const DetailSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

export const DetailEmptyState = styled.div`
  color: #666;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

export const DetailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const DetailModalContent = styled.div`
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const DetailModalTitle = styled.h2`
  color: #dbdbdb;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: Denike;
`;

export const DetailContentList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;

export const DetailContentItem = styled.div`
  background-color: #333;
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #444;
  }
`;

export const DetailContentItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailContentItemName = styled.span`
  color: #dbdbdb;
  font-family: Denike;
  font-size: 1.1rem;
`;

export const DetailContentItemCategory = styled.span`
  color: #666;
  font-family: Denike;
  font-size: 0.9rem;
`;

export const DetailContentItemExclusive = styled.span<{ isExclusive: boolean }>`
  color: ${(props) => (props.isExclusive ? '#ff6642' : '#666')};
  font-family: Denike;
  font-size: 0.9rem;
`;

export const DetailErrorMessage = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DetailCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
`; 