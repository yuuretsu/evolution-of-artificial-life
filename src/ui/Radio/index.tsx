import styled from 'styled-components';
import { FlexColumn } from 'ui/FlexColumn';

import { RadioElement } from './components/RadioElement';

import type { FC } from 'react';

const Wrapper = styled.div`
  display: block;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

type RadioProps = {
  name: string;
  list: { value: string; title: string }[];
  onChange: (value: string) => void;
  checked?: string;
};

export const Radio: FC<RadioProps> = (props) => {
  return (
    <Wrapper>
      <FlexColumn gap={5}>
        {props.list.map((variant) => (
          <RadioElement
            key={variant.value}
            name={props.name}
            title={variant.title}
            checked={variant.value == props.checked}
            value={variant.value}
            onChange={props.onChange}
          />
        ))}
      </FlexColumn>
    </Wrapper>
  );
};
