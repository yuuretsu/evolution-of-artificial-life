import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { keyframes } from "styled-components";

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
  width: 100%;
  cursor: pointer;
  border-radius: ${props => props.opened ? '5px 5px 0 0' : '2px'};
  padding: ${props => props.opened ? '10px' : 'none'};
  background-color: ${props => props.opened ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition-duration: 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: ${props => props.opened ? '10px' : '5px'};
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

const DropdownSmall: React.FC<{
  name: string,
  list: { value: string, title: string }[],
  onChange: (value: string) => any
}> = (props) => {
  const [opened, setOpened] = React.useState(false);
  return (
    <Wrapper>
      <Header
        onClick={() => setOpened(!opened)}
        opened={opened}
      >
        {props.name}
        <MdKeyboardArrowDown
          style={{
            minWidth: '15px',
            minHeight: '15px',
            transform: 'translateY(3px)',
            marginLeft: '5px',
          }}
        />
      </Header>
      {opened && <Body>
        {props.list.map(value => {
          return (
            <Select
              key={value.value}
              onClick={e => {
                setOpened(false);
                props.onChange(value.value);
              }}
            >
              {value.title}
            </Select>
          );
        })}
      </Body>}
    </Wrapper>
  );
};

export default DropdownSmall;