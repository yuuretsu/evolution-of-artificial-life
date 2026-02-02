import { forwardRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';
import { FlexColumn } from 'shared/ui';

import type { CSSProperties, FC, ReactNode } from 'react';

interface IHeadWrapper {
  readonly isSmall: boolean | undefined,
  readonly color?: string,
}

const HeadWrapper = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'isSmall'
}) <IHeadWrapper>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  text-transform: ${props => props.isSmall ? 'none' : 'uppercase'};
  font-weight: ${props => props.isSmall ? 'normal' : 'bold'};
  font-size: ${props => props.isSmall ? 'inherit' : '1.25em'};
  border-left: 8px solid ${props => props.color ? props.color : 'rgb(80, 80, 80)'};
  padding: ${({ isSmall }) => isSmall ? '4px' : '8px'};
  padding-right: 4px;
  padding-left: 8px;
  border-radius: 8px;
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

  const [size, marginLeft] = isSmall
    ? ['20px', '10px']
    : ['25px', '20px'];

  return (
    <MdKeyboardArrowDown
      style={{
        transform: isOpen ? 'none' : 'rotate(-90deg)',
        transitionDuration: '0.2s',
        minWidth: size,
        minHeight: size,
        marginLeft,
      }}
    />
  );
};

export type AccordionProps = {
  name: ReactNode;
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
        <span>
          {props.name}
        </span>
        <Arrow
          isOpen={props.isOpen}
          isSmall={props.isSmall}
        />
      </HeadWrapper>
      {props.isOpen && <BodyWrapper>{props.children}</BodyWrapper>}
    </FlexColumn>
  );
});
