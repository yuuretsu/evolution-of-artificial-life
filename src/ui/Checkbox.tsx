import styled from 'styled-components';

import type { FC } from 'react';

const Wrapper = styled.label`
  display: block;
  user-select: none;
  cursor: pointer;
`;

const Input = styled.input.attrs({
  type: 'checkbox',
})`
  position: relative;
  appearance: none;
  margin: 0;
  margin-right: 8px;
  outline: none;
  border: none;
  &:checked::after {
    transform: rotateZ(-45deg);
    opacity: 1;
  }
  &::before {
    content: "";
    box-sizing: border-box;
    transform: translate(0px, 2px);
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background-color: ${props => props.color || 'rgb(80, 80, 80)'};
    transition-duration: 0.2s;
  }
  &::after {
    content: "";
    position: absolute;
    display: block;
    left: 1px;
    top: 3px;
    width: 10px;
    height: 5px;
    transform: translateY(-2px) rotateZ(-45deg);
    border-bottom: 4px solid whitesmoke;
    border-left: 4px solid whitesmoke;
    opacity: 0;
    transition-duration: 0.2s;
  }
`;

export interface ICheckboxProps {
  title: string;
  onChange: (checked: boolean) => void;
  isChecked?: boolean;
  color?: string;
}

export const Checkbox: FC<ICheckboxProps> = (props) => {
  return (
    <Wrapper>
      <Input
        checked={props.isChecked}
        color={props.color}
        onChange={(e) => {
          props.onChange(e.target.checked);
        }}
      />
      {props.title}
    </Wrapper>
  );
};
