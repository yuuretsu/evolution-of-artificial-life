import type { FC, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

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
  background-color: rgb(40, 40, 40);
  border-left: 5px solid rgb(80, 80, 80);
  padding: 10px;
  border-radius: 0 5px 5px 0;
  animation: ${anim} 0.2s ease;
  transform-origin: top;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
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
