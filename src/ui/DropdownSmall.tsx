import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';

import type { ReactNode } from 'react';

const Wrapper = styled.div`
  position: relative;
  user-select: none;
`;

interface IHeader {
  isOpen?: boolean;
}

const Header = styled.div<IHeader>`
  box-sizing: border-box;
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border-radius: ${(props) => (props.isOpen ? '5px 5px 0 0' : '2px')};
  padding: ${(props) => (props.isOpen ? '10px' : 'none')};
  background-color: ${(props) =>
    props.isOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition-duration: 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: ${(props) => (props.isOpen ? '10px' : '5px')};
  }
  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
    outline: none;
    border: none;
  }
`;

const anim = keyframes`
  from {
    opacity: 0;
  }
`;

const Body = styled.div`
  z-index: 999;
  box-sizing: border-box;
  position: absolute;
  background-color: #282828;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.5);
  width: 100%;
  animation: ${anim} 0.2s;
`;

const Select = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #505050;
  }
`;

const IconArrow = styled(MdKeyboardArrowDown)`
  min-width: 15px;
  min-height: 15px;
  margin-left: 5px;
`;

export interface IDropdownSmallProps<T extends string> {
  value: T;
  options: { value: T; title: ReactNode }[];
  onChange: (value: T) => void;
}

export const DropdownSmall = <T extends string,>(props: IDropdownSmallProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const title = props.options.find((item) => item.value === props.value)?.title;

  return (
    <Wrapper>
      <Header onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        {title}
        <IconArrow />
      </Header>
      {isOpen && (
        <Body>
          {props.options.map((value) => {
            return (
              <Select
                key={value.value}
                onClick={() => {
                  setIsOpen(false);
                  props.onChange(value.value);
                }}
              >
                {value.title}
              </Select>
            );
          })}
        </Body>
      )}
    </Wrapper>
  );
};
