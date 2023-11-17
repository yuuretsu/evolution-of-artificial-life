import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';
import { FlexColumn, FlexRow } from 'ui';

import type { CSSProperties, FC, ReactNode } from 'react';

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

interface IArrowProps {
  isOpen?: boolean;
  isSmall?: boolean;
}

const Arrow: FC<IArrowProps> = ({ isOpen, isSmall }) => {

  const size = isSmall
    ? '20px'
    : '25px';

  return (
    <MdKeyboardArrowDown
      style={{
        transform: isOpen ? 'none' : 'rotate(-90deg)',
        transitionDuration: '0.2s',
        minWidth: size,
        minHeight: size,
      }}
    />
  );
};

const Controls = styled(FlexRow) <{ isSmall?: boolean }>`
  margin-left: ${({ isSmall }) => isSmall ? '10px' : '20px'};
`;

export type AccordionProps = {
  name: ReactNode;
  additionalButtonsSlot?: ReactNode;
  children?: ReactNode;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  isSmall?: boolean;
  color?: string;
  style?: CSSProperties;
};

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const handleClickHead = () => props.onToggle(!props.isOpen);
  const gap = props.isSmall ? 5 : 10;
  return (
    <FlexColumn gap={gap} ref={ref} style={props.style}>
      <HeadWrapper
        onClick={handleClickHead} isSmall={props.isSmall}
        color={props.color}
      >
        {props.name}
        <Controls alignItems='center'>
          {props.additionalButtonsSlot}
          <Arrow
            isOpen={props.isOpen}
            isSmall={props.isSmall}
          />
        </Controls>
      </HeadWrapper>
      {props.isOpen && <BodyWrapper>{props.children}</BodyWrapper>}
    </FlexColumn>
  );
});
