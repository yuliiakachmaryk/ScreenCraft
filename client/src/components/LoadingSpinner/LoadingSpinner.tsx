import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({
  text = 'Loading...',
}: LoadingSpinnerProps) => {
  return (
    <LoadingState>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingState>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingState = styled.div`
  color: #dbdbdb;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #333;
  border-top: 4px solid #ff6642;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  font-family: Denike;
  color: #ff6642;
`;
