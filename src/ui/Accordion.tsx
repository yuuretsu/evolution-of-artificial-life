import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';
import { FlexColumn } from 'ui';

import type { CSSProperties, ReactNode } from 'react';

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
  padding: ${({ isSmall }) => isSmall ? '3px' : '5px'};
  padding-right: 5px;
  padding-left: 10px;
  border-radius: 2px;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  user-select: none;
  background-color: rgba(80, 80, 80, 0.25);
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

export type AccordionProps = {
  name: string;
  children?: ReactNode;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  isSmall?: boolean;
  color?: string;
  style?: CSSProperties;
};

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const handleClickHead = () => props.onToggle(!props.isOpen);
  return (
    <FlexColumn gap={props.isSmall ? 5 : 10} ref={ref} style={props.style}>
      <HeadWrapper
        onClick={handleClickHead} isSmall={props.isSmall}
        color={props.color}
      >
        <span>
          {props.name}
        </span>
        <MdKeyboardArrowDown
          style={{
            transform: props.isOpen ? 'none' : 'rotate(-90deg)',
            transitionDuration: '0.2s',
            minWidth: props.isSmall ? '20px' : '25px',
            minHeight: props.isSmall ? '20px' : '25px',
            marginLeft: props.isSmall ? '10px' : '20px'
          }}
        />
      </HeadWrapper>
      {props.isOpen && <BodyWrapper>{props.children}</BodyWrapper>}
    </FlexColumn>
  );
});
