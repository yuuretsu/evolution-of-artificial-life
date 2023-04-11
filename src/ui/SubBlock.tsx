import { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Title = styled.div`
    margin-bottom: 5px;
`;

type SubBlockProps = {
  name?: string;
  children?: React.ReactNode;
};

export const SubBlock: FC<SubBlockProps> = (props) => {
  return (
    <Wrapper>
      {props.name && <Title>{props.name}</Title>}
      {props.children}
    </Wrapper>
  );
};
