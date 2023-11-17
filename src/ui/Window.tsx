import styled from 'styled-components';
import { useRef, type PropsWithChildren, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useDrag } from 'hooks';

import { FlexColumn, FlexRow } from './Flex';

import type { ReactNode } from 'react';

export interface IWindowProps extends PropsWithChildren {
  title: ReactNode,
}

export const Window = ({ title, children }: IWindowProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [dx, dy] = useDrag(ref, [20, 20]);

  const [isOpen, setIsOpen] = useState(true);


  return (
    <Wrapper style={{ top: dy, left: dx }}>
      <FlexColumn gap={5}>
        <ControlBar ref={ref}>
          <FlexRow gap={5} alignItems='center'>
            <ControlBarButton onClick={() => setIsOpen(is => !is)}>
              <MdKeyboardArrowDown size={20} color='white' style={{ transform: isOpen ? 'none' : 'rotate(-90deg)' }} />
            </ControlBarButton>
            {title}
          </FlexRow>
        </ControlBar>
        {isOpen && <Body>{children}</Body>}
      </FlexColumn>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
`;

const ControlBar = styled.div`
  background-color: white;
  cursor: move;
  user-select: none;
  padding: 5px;
  padding-right: 10px;
  border-radius: 50px;
  color: black;
  width: fit-content;
  font-weight: bold;
`;

const ControlBarButton = styled.button`
  background-color: black;
  border: none;
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  border-radius: 10px;
  cursor: pointer;
`;

const Body = styled.div`
  width: 260px;
  max-height: 500px;
  overflow: auto;
  padding: 20px;
  background-color: rgba(20, 20, 20, 0.8);
  color: whitesmoke;
  backdrop-filter: blur(20px);
  border-radius: 10px;
`;