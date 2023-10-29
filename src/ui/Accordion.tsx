import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled from 'styled-components';

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
  padding-left: 10px;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  user-select: none;
  transition-duration: 0.2s;
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const BodyWrapper = styled.div<{ isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ isOpen }) => isOpen ? '1fr' : '0fr'};
  overflow: hidden;
  transition-duration: 0.2s;
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
    <div ref={ref} style={props.style}>
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
      <BodyWrapper isOpen={props.isOpen}>
        <div style={{ minHeight: 0 }}>
          <div style={{ paddingTop: props.isSmall ? 5 : 10 }}>
            {props.children}
          </div>
        </div>
      </BodyWrapper>
    </div>
  );
});
