import styled from 'styled-components';
import { FlexColumn } from 'ui';

export const WindowInFloatingMode = () => {
  return (
    <WindowInFloatingModeWrapper>
      Окно в плавающем режиме
    </WindowInFloatingModeWrapper>
  );
};

const WindowInFloatingModeWrapper = styled(FlexColumn)`
  border: 2px solid rgb(80, 80, 80);
  padding: 10px;
  background-color: rgba(80, 80, 80, 0.1);
  color: rgb(80, 80, 80);
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
`;
