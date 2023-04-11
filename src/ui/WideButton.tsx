import styled from 'styled-components';

export const WideButton = styled.button`
    display: block;
    font-size: 100%;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    border-radius: 5px;
    padding: 4px 10px;
    color: whitesmoke;
    background-color: rgb(80, 80, 80);
    border: none;
    outline: none;
    line-height: 20px;
    cursor: pointer;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition-duration: 0.2s;
    &:active {
        box-shadow: none;
        background-color: rgb(60, 60, 60);
    }
    &:not(:last-child) {
        margin-bottom: 5px;
    }
`;
