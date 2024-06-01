import styled from 'styled-components';

export const RoundedButton = styled.button`
  background-color: rgb(80, 80, 80);
  border-radius: 15px;
  border: none;
  outline: none;
  margin: 0;
  padding: 5px;
  cursor: pointer;
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
