import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
`;

export const CircleButton = styled.button`
  background-color: rgb(80, 80, 80);
  border-radius: 100px;
  border: none;
  outline: none;
  margin: 0;
  padding: 5px;
  cursor: pointer;
  animation: ${animation} 0.2s ease;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  transition-duration: 0.2s;
  & > * {
    display: block;
  }
  &:active {
    box-shadow: none;
    background-color: rgb(60, 60, 60);
  }
  &:active > * {
    transform: scale(0.8);
  }
`;

export const CIRCLE_BUTTON_ICON_STYLE: React.CSSProperties = {
  width: '25px',
  height: '25px',
  fill: 'whitesmoke'
};
