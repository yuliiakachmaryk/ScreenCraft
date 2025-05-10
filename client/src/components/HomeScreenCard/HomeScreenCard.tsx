import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { HomeScreen } from '../../types';
import { ContentSection } from '../ContentSection/ContentSection';

interface HomeScreenCardProps {
  screen: HomeScreen;
}

export const HomeScreenCard = ({ screen }: HomeScreenCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/home-screen/${screen._id}`);
  };

  return (
    <Card onClick={handleClick}>
      <Status isActive={screen.isActive}>
        {screen.isActive ? 'Active' : 'Inactive'}
      </Status>
      <Sections>
        <ContentSection
          title="Recommendations"
          items={screen.recomendaciones}
        />
        <ContentSection title="Top Charts" items={screen.topCharts} />
        <ContentSection title="Most Trending" items={screen.mostTrending} />
        <ContentSection title="Most Popular" items={screen.mostPopular} />
      </Sections>
    </Card>
  );
};

const Card = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #333;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Status = styled.h3<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#ff6642' : '#666')};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: Denike;
`;

const Sections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;
