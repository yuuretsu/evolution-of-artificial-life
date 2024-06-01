import styled from 'styled-components';

export const RoundedButton = styled.button`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(80, 80, 80);
  border-radius: 15px;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
