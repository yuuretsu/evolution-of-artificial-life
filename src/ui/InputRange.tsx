import styled from 'styled-components';

export const InputRange = styled.input.attrs({
    type: "range",
})`
    display: block;
    box-sizing: border-box;
    width: 100%;
    appearance: none;
    background-color: transparent;
    margin: 0;
    &:not(:last-child) {
        margin-bottom: 5px;
    }
    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 15px;
        cursor: pointer;
        background-color: rgb(80, 80, 80);
        border-radius: 10px;
    }
    &::-moz-range-track {
        width: 100%;
        height: 15px;
        cursor: pointer;
        background-color: rgb(80, 80, 80);
        border-radius: 10px;
    }
    &::-webkit-slider-thumb {
        appearance: none;
        height: 15px;
        width: 15px;
        border-radius: 7.5px;
        background: whitesmoke;
        cursor: pointer;
    }
    &::-moz-range-thumb {
        height: 15px;
        width: 15px;
        border-radius: 7.5px;
        border: none;
        background: whitesmoke;
        cursor: pointer;
    }
`;

export default InputRange;