import { useRef } from 'react';
import styled from 'styled-components';

import type { ChangeEventHandler, FC, FocusEventHandler } from 'react';

const Wrapper = styled.div`
  display: flex;
  cursor: text;
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
  appearance: textfield;
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

export interface IInputNumberSmallProps {
  name?: string;
  min?: string | number;
  max?: string | number;
  value?: string | number | readonly string[]
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const InputNumberSmall: FC<IInputNumberSmallProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onClickLabel = () => inputRef.current?.focus();
  return (
    <Wrapper>
      {props.name && <span style={{ whiteSpace: 'nowrap' }} onClick={onClickLabel}>
        {props.name}:&nbsp;
      </span>}
      <Input ref={inputRef} {...props} />
    </Wrapper>
  );
};
