import styled, { keyframes } from 'styled-components';

const animation = keyframes`
    0% {
        transform: scale(0.8);
    }

    100% {
        transform: scale(1);
    }
`;

const RoundButton = styled.button`
    background-color: rgb(80, 80, 80);
    border-radius: 100px;
    border: none;
    outline: none;
    margin: 0;
    padding: 5px;
    cursor: pointer;
    animation: ${animation} 0.2s ease;
    & > * {
        display: block;
        transition-duration: 0.2s;
    }
    &:active > * {
        transform: scale(0.8);
    }
`;

export const ROUND_BUTTON_ICON_STYLE: React.CSSProperties = {
    width: '25px',
    height: '25px',
    fill: 'whitesmoke'
};

export default RoundButton;