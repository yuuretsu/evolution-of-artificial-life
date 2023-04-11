import styled from "styled-components";
import { RadioElement } from "./components/RadioElement";

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
  defaultChecked?: string;
};

export const Radio = (props: RadioProps) => {
  return (
    <Wrapper>
      {props.list.map((variant) => (
        <RadioElement
          key={variant.value}
          name={props.name}
          title={variant.title}
          defaultChecked={variant.value == props.defaultChecked}
          value={variant.value}
          onChange={props.onChange}
        />
      ))}
    </Wrapper>
  );
};
