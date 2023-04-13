import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.25em;
  text-transform: uppercase;
`;

type BlockProps = {
  name?: string;
  children?: ReactNode;
};

export const Block: FC<BlockProps> = ({ name, children }) => {
  return (
    <div>
      {name && <Title>{name}</Title>}
      {children}
    </div>
  );
};
