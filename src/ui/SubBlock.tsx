import { FC } from 'react';
import { FlexColumn } from './FlexColumn';

type SubBlockProps = {
  name?: string;
  children?: React.ReactNode;
};

export const SubBlock: FC<SubBlockProps> = (props) => {
  return (
    <FlexColumn gap={5}>
      {props.name && props.name}
      <div>
        {props.children}
      </div>
    </FlexColumn>
  );
};
