import styled from 'styled-components';

const Wrapper = styled.label`
  display: block;
  user-select: none;
  cursor: pointer;
`;

const Input = styled.input.attrs({
  type: 'radio',
})`
  position: relative;
  appearance: none;
  margin: 0;
  margin-right: 5px;
  outline: none;
  border: none;
  &:checked::after {
    transform: none;
    opacity: 1;
  }
  &::before {
    content: "";
    box-sizing: border-box;
    transform: translate(0px, 2px);
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background-color: rgb(80, 80, 80);
    transition-duration: 0.2s;
  }
  &::after {
    content: "";
    position: absolute;
    display: block;
    transform: scale(0);
    background-color: whitesmoke;
    width: 9px;
    height: 9px;
    border-radius: 100%;
    left: 3px;
    top: 5px;
    opacity: 0;
    transition-duration: 0.2s;
  }
`;

type RadioElementProps = {
  title: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  checked?: boolean;
};

export const RadioElement = (props: RadioElementProps) => {
  return (
    <Wrapper>
      <Input
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={(e) => props.onChange(props.value)}
      />
      {props.title}
    </Wrapper>
  );
};
