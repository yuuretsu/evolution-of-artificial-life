import React from "react";
import styled from 'styled-components';
import { limit } from "../../../lib/helpers";

// const InputNumberSmall = styled.input.attrs({
//     type: "number",
// })`
//     box-sizing: border-box;
//     font-size: 100%;
//     border: none;
//     outline: none;
//     border-radius: 5px;
//     padding: 3px 8px;
//     line-height: 20px;
//     background-color: rgb(40, 40, 40);
//     color: whitesmoke;
//     margin-bottom: 5px;
//     transition-duration: 0.2s;
//     -moz-appearance: textfield;
//     &::-webkit-inner-spin-button {
//       appearance: none;
//     }
//     &:focus {
//       box-shadow: 0 0 0 2px rgba(50, 50, 50);
//     }
//   `;

const Wrapper = styled.div`
  display: flex;
`;

const Input = styled.input.attrs({ type: 'number' })`
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: 0.2s;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button {
    appearance: none;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: 5px;
    border-radius: 2px;
  }
  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 5px;
    border-radius: 2px;
    outline: none;
    border: none;
  }
`;

const InputNumberSmall: React.FC<{
  name: string,
  min?: string | number,
  max?: string | number,
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onBlur?: React.FocusEventHandler<HTMLInputElement>,
}> = (props) => {
  return (
    <Wrapper>
      <span style={{ whiteSpace: 'nowrap' }}>{props.name}:&nbsp;</span>
      <Input
        {...props}
      />
    </Wrapper>
  );
};

export default InputNumberSmall;