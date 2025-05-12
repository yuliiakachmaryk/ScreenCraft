import styled from 'styled-components';

export const Card = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #333;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  font-family: Denike;
`;

export const CardStatus = styled.span<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#ff6642' : '#666')};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${({ isActive }) => (isActive ? 'rgba(255, 102, 66, 0.1)' : 'rgba(102, 102, 102, 0.1)')};
`;

export const CardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const CardSection = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
`;

export const CardSectionTitle = styled.h3`
  font-size: 1rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

export const CardSectionCount = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CardButton = styled.button`
  background-color: #ff6642;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff4d26;
  }
`; 