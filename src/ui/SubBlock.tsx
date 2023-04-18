import { FlexColumn } from 'ui';

import type { FC, ReactNode } from 'react';

type SubBlockProps = {
  name?: string;
  children?: ReactNode;
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
