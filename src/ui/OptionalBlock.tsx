import styled, { keyframes } from 'styled-components';

import type { FC, ReactNode } from 'react';

const anim = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const Wrapper = styled.div`
  background-color: rgb(80, 80, 80, 0.25);
  border-left: 5px solid rgb(80, 80, 80);
  padding: 10px;
  border-radius: 5px;
  animation: ${anim} 0.2s ease;
  transform-origin: top;
`;

const Title = styled.div`
  margin-bottom: 5px;
`;

type OptionalBlockProps = {
  title?: string;
  children?: ReactNode;
};

export const OptionalBlock: FC<OptionalBlockProps> = (props) => {
  return (
    <Wrapper>
      {props.title && <Title>{props.title}</Title>}
      {props.children}
    </Wrapper>
  );
};
