import { DetailErrorMessage, DetailCloseButton } from './styles';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export const ErrorMessage = ({ message, onClose }: ErrorMessageProps) => {
  return (
    <DetailErrorMessage>
      {message}
      <DetailCloseButton onClick={onClose}>×</DetailCloseButton>
    </DetailErrorMessage>
  );
};
