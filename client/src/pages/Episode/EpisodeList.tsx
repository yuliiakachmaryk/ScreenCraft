import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEpisodes } from '../../store/slices/episodeSlice';
import { Episode } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { EpisodeCard } from '../../components/EpisodeCard/EpisodeCard';
import { DetailButton } from '../../components/HomeScreen/styles';

export const EpisodeList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: episodes, loading } = useAppSelector((state) => state.episode);

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner text="Loading episodes..." />;
  }

  return (
    <PageContainer>
      <Header>
        <Title>Episodes</Title>
        <Subtitle>Browse and manage your episode collection</Subtitle>
      </Header>
      
      <ContentSection>
        {episodes && episodes.length > 0 ? (
          <CardContainer>
            {episodes.map((episode: Episode) => (
              <EpisodeCardWrapper key={episode._id}>
                <EpisodeCard episode={episode} />
                <DetailButton onClick={() => navigate(`/episodes/${episode._id}`)}>
                  Edit Episode
                </DetailButton>
              </EpisodeCardWrapper>
            ))}
          </CardContainer>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🎬</EmptyStateIcon>
            <EmptyStateText>No episodes available</EmptyStateText>
            <EmptyStateSubtext>Add new episodes to get started</EmptyStateSubtext>
          </EmptyState>
        )}
      </ContentSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: Denike;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1.2rem;
  font-family: Denike;
`;

const ContentSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin: 2rem auto;
  max-width: 500px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-family: Denike;
`;

const EmptyStateSubtext = styled.p`
  color: #888;
  font-size: 1.1rem;
  font-family: Denike;
`;

const EpisodeCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`; 