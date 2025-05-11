import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: #dbdbdb;
  font-size: 2.5rem;
  font-family: Denike;
`;

export const DetailButton = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.$danger ? '#ff4444' : props.$primary ? '#666' : '#444'};
  background-color: ${props => props.$danger ? '#ff4444' : props.$primary ? '#333' : 'transparent'};
  color: ${props => props.$danger ? '#fff' : '#dbdbdb'};
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$danger ? '#ff6666' : props.$primary ? '#444' : '#333'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmptyState = styled.div`
  color: #666;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
`;

export const PaginationInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    color: #fff;
    font-size: 0.9rem;
  }
`;

export const ItemsPerPageSelect = styled.select`
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  option {
    background: #2a2a2a;
    color: #fff;
  }
`;

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

export const DetailSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
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

export const DetailEmptyState = styled.div`
  color: #666;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  div {
    font-size: 3rem;
  }

  h2 {
    color: #dbdbdb;
    font-family: Denike;
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

export const PageNumbers = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const PageNumber = styled.button<{ active: boolean }>`
  background: ${({ active }) => active ? '#ff6642' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: Denike;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => active ? '#ff6642' : 'rgba(255, 255, 255, 0.2)'};
  }
`; 