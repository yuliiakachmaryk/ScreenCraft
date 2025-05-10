import styled from 'styled-components';

interface SharedCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string | number | boolean;
  }>;
}

export const SharedCard = ({ title, items }: SharedCardProps) => {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardInfo>
        {items.map((item, index) => (
          <InfoItem key={index}>
            <InfoLabel>{item.label}:</InfoLabel>
            <InfoValue>
              {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value}
            </InfoValue>
          </InfoItem>
        ))}
      </CardInfo>
    </Card>
  );
};

const Card = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardTitle = styled.h3`
  color: #dbdbdb;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: Denike;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #242424;
  border-radius: 6px;
`;

const InfoLabel = styled.span`
  color: #666;
  font-family: Denike;
`;

const InfoValue = styled.span`
  color: #dbdbdb;
  font-family: Denike;
`; 