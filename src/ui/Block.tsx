import { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.25em;
  text-transform: uppercase;
`;

type BlockProps = {
  name?: string;
  children?: React.ReactNode;
};

export const Block: FC<BlockProps> = ({ name, children }) => {
  return (
    <Wrapper>
      {name && <Title>{name}</Title>}
      {children}
    </Wrapper>
  );
};
