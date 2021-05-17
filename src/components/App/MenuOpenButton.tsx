import styled from 'styled-components';

interface IMenuOpenButton {
    readonly distance: string;
    readonly sidebarWidth: string;
    readonly sidebarOpened: boolean;
}

const MenuOpenButton = styled.button<IMenuOpenButton>`
    position: fixed;
    top: ${props => props.distance};
    left: ${props =>
        `calc(${props.sidebarOpened ? props.sidebarWidth : '0px'} + ${props.distance})`
    };
    background-color: rgb(80, 80, 80);
    color: inherit;
    border-radius: 100px;
    border: none;
    margin: 0;
    padding: 5px;
    & > * {
        display: block;
    }
    transition-duration: 0.2s;
`;

export default MenuOpenButton;