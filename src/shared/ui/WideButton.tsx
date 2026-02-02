import styled from 'styled-components';

export const WideButton = styled.button`
  display: block;
  font-size: 100%;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  padding: 4px 10px;
  color: whitesmoke;
  background-color: rgb(80, 80, 80, 0.75);
  border: none;
  outline: none;
  line-height: 20px;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgb(80, 80, 80);
  transition-duration: 0.2s;
  &:hover {
    background-color: rgb(80, 80, 80, 0.5);
  }
  &:active {
    box-shadow: none;
    background-color: rgb(60, 60, 60);
  }
`;
