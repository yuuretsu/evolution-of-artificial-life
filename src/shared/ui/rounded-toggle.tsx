import styled from 'styled-components';

import { RoundedButton } from './rounded-button';

import type { ReactNode } from 'react';

const SIZE = '35px';

const Outer = styled.div`
  position: relative;
  width: ${SIZE};
  height: ${SIZE};
`;

const Inner = styled.div<{ isA: boolean }>`
  position: absolute;
  top: ${({ isA }) => isA ? '0' : `-${SIZE}`};
  transition-duration: 0.2s;
`;

const Item = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE};
  height: ${SIZE};
  transform: scale(${({ isActive }) => isActive ? 1 : 0.1});
  transition-duration: 0.2s;
`;

type RoundedToggleProps = {
  title?: string;
  slotA: ReactNode;
  slotB: ReactNode;
  isA: boolean;
  onChange: (isA: boolean) => void;
};

export const RoundedToggle = ({ slotA, slotB, isA, onChange, title }: RoundedToggleProps) => {
  const handleClick = () => onChange(!isA);
  return (
    <RoundedButton onClick={handleClick} title={title}>
      <Outer>
        <Inner isA={isA}>
          <Item isActive={isA}>
            {slotA}
          </Item>
          <Item isActive={!isA}>
            {slotB}
          </Item>
        </Inner>
      </Outer>
    </RoundedButton>
  );
};