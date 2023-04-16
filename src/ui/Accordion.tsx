import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';

import { FlexColumn } from './FlexColumn';

import type { FC, ReactNode } from 'react';

interface IHeadWrapper {
  readonly isSmall: boolean | undefined,
  readonly color?: string,
}

const HeadWrapper = styled.div<IHeadWrapper>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  text-transform: ${props => props.isSmall ? 'none' : 'uppercase'};
  font-weight: ${props => props.isSmall ? 'normal' : 'bold'};
  font-size: ${props => props.isSmall ? 'inherit' : '1.25em'};
  border-left: 5px solid ${props => props.color ? props.color : 'rgb(80, 80, 80)'};
  padding-left: 10px;
  justify-content: space-between;
  cursor: pointer;
  /* align-items: center; */
  user-select: none;
  transition-duration: 0.2s;
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const anim = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const BodyWrapper = styled.div`
  animation: ${anim} 0.5s;
`;

type AccordionProps = {
  name: string;
  children?: ReactNode,
  isDefaultOpened?: boolean,
  isSmall?: boolean
  color?: string,
};

export const Accordion: FC<AccordionProps> = (props) => {
  const [isOpen, setIsOpen] = useState(props.isDefaultOpened);
  return (
    <FlexColumn gap={props.isSmall ? 5 : 10}>
      <HeadWrapper
        onClick={() => setIsOpen(!isOpen)} isSmall={props.isSmall}
        color={props.color}
      >
        <span>
          {props.name}
        </span>
        <MdKeyboardArrowDown
          style={{
            transform: isOpen ? 'none' : 'rotate(-90deg)',
            transitionDuration: '0.2s',
            minWidth: props.isSmall ? '20px' : '25px',
            minHeight: props.isSmall ? '20px' : '25px',
            marginLeft: props.isSmall ? '10px' : '20px'
          }}
        />
      </HeadWrapper>
      {isOpen && <BodyWrapper>{props.children}</BodyWrapper>}
    </FlexColumn>
  );
};
