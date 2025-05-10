import { SharedCard } from '../SharedCard/SharedCard';
import { Episode } from '../../types';

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  const items = [
    { label: 'Likes', value: episode.likesNumber },
    { label: 'Reviewed', value: episode.reviewed },
    { label: 'Exclusive', value: episode.isExclusive },
  ];

  return <SharedCard title={episode.name} items={items} />;
}; 