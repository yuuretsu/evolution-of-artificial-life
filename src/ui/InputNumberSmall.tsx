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
  &:hover, &:focus {
    background-color: rgb(80, 80, 80, 0.25);
    border-radius: 2px;
    box-shadow: 0 0 0 2px rgb(80, 80, 80, 0.25);
    z-index: 1;
  }
  &:focus {
    box-shadow: 0 0 0 5px rgb(80, 80, 80, 0.25);
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
