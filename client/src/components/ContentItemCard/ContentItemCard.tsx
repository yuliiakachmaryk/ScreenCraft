import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ContentItem } from '../../types';
import { DetailButton } from '../HomeScreen/styles';

interface ContentItemCardProps {
  item: ContentItem;
}

export const ContentItemCard = ({ item }: ContentItemCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardImage src={item.introImage} alt={item.name} />
      <CardContent>
        <CardTitle>{item.name}</CardTitle>
        <CardCategory>{item.category}</CardCategory>
        <CardStatus isExclusive={item.isExclusive}>
          {item.isExclusive ? 'Exclusive' : 'Regular'}
        </CardStatus>
        <DetailButton onClick={() => navigate(`/content-items/${item._id}`)}>
          View Details
        </DetailButton>
      </CardContent>
    </Card>
  );
};

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0;
  font-family: Denike;
`;

const CardCategory = styled.p`
  color: #888;
  font-size: 1rem;
  margin: 0;
  font-family: Denike;
`;

const CardStatus = styled.span<{ isExclusive: boolean }>`
  color: ${({ isExclusive }) => (isExclusive ? '#ff6642' : '#4CAF50')};
  font-size: 0.9rem;
  font-family: Denike;
`; 