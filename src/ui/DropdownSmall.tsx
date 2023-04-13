import { FC, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  user-select: none;
`;

interface IHeader {
  opened?: boolean;
}

const Header = styled.div<IHeader>`
  box-sizing: border-box;
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border-radius: ${(props) => (props.opened ? '5px 5px 0 0' : '2px')};
  padding: ${(props) => (props.opened ? '10px' : 'none')};
  background-color: ${(props) =>
    props.opened ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition-duration: 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: ${(props) => (props.opened ? '10px' : '5px')};
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

export interface IDropdownSmallProps {
  name: string;
  list: { value: string; title: string }[];
  onChange: (value: string) => void;
}

export const DropdownSmall: FC<IDropdownSmallProps> = (props) => {
  const [opened, setOpened] = useState(false);
  return (
    <Wrapper>
      <Header onClick={() => setOpened(!opened)} opened={opened}>
        {props.name}
        <IconArrow />
      </Header>
      {opened && (
        <Body>
          {props.list.map((value) => {
            return (
              <Select
                key={value.value}
                onClick={() => {
                  setOpened(false);
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
