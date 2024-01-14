import styled from 'styled-components';

export const InputNumber = styled.input.attrs({
  type: 'number',
})`
  display: block;
  box-sizing: border-box;
  font-size: 100%;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 3px 8px;
  line-height: 20px;
  background-color: rgb(40, 40, 40, 0.5);
  color: whitesmoke;
  transition-duration: 0.2s;
  appearance: textfield;
  -moz-appearance: textfield;
  box-shadow: 0 0 0 1px rgba(80, 80, 80, 0.25);
  &::-webkit-inner-spin-button {
    appearance: none;
  }
  &:focus {
    box-shadow: 0 0 0 2px rgba(80, 80, 80);
  }
`;
