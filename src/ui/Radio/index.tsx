import styled from "styled-components";
import { RadioElement } from "./components/RadioElement";
import { FlexColumn } from "ui/FlexColumn";

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

export const Radio = (props: RadioProps) => {
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
