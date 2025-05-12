import { Link } from 'react-router-dom';
import { HomeScreen } from '../../types/homeScreen';
import {
  Card,
  CardHeader,
  CardTitle,
  CardStatus,
  CardContent,
  CardSection,
  CardSectionTitle,
  CardSectionCount,
  CardActions,
  CardButton,
} from './styles';

interface HomeScreenCardProps {
  screen: HomeScreen;
}

export const HomeScreenCard = ({ screen }: HomeScreenCardProps) => {
  const sortedSections = [...screen.sections].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Screen</CardTitle>
        <CardStatus isActive={screen.isActive}>
          {screen.isActive ? 'Active' : 'Inactive'}
        </CardStatus>
      </CardHeader>
      <CardContent>
        {sortedSections.map((section) => (
          <CardSection key={section.name}>
            <CardSectionTitle>{section.name}</CardSectionTitle>
            <CardSectionCount>{section.items.length} items</CardSectionCount>
          </CardSection>
        ))}
      </CardContent>
      <CardActions>
        <Link to={`/home-screen/${screen._id}`}>
          <CardButton>View Details</CardButton>
        </Link>
      </CardActions>
    </Card>
  );
};
