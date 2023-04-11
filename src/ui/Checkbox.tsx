import styled from "styled-components";

const Wrapper = styled.label`
  display: block;
  user-select: none;
  cursor: pointer;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const Input = styled.input.attrs({
  type: "checkbox",
})`
  position: relative;
  appearance: none;
  margin: 0;
  margin-right: 5px;
  outline: none;
  border: none;
  &:checked::after {
    transform: rotateZ(-45deg);
    opacity: 1;
  }
  &::before {
    content: "";
    box-sizing: border-box;
    transform: translate(0px, 2px);
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background-color: rgb(80, 80, 80);
    transition-duration: 0.2s;
  }
  &::after {
    content: "";
    position: absolute;
    display: block;
    left: 1px;
    top: 3px;
    width: 10px;
    height: 5px;
    transform: translateY(-2px) rotateZ(-45deg);
    border-bottom: 4px solid whitesmoke;
    border-left: 4px solid whitesmoke;
    opacity: 0;
    transition-duration: 0.2s;
  }
`;

export interface ICheckboxProps {
  title: string;
  value: string;
  onChange: (value: string, checked: boolean) => void;
  checked?: boolean;
}

export const Checkbox: React.FC<ICheckboxProps> = (props) => {
  return (
    <Wrapper>
      <Input
        value={props.value}
        checked={props.checked}
        onChange={(e) => {
          props.onChange(e.target.value, e.target.checked);
        }}
      />
      {props.title}
    </Wrapper>
  );
};
