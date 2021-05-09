import styled from 'styled-components';
import React from 'react';

interface IRoundButtonsGroup {
    readonly sidebarWidth: string;
    readonly sidebarOpened: boolean;
};

const Wrapper = styled.div<IRoundButtonsGroup>`
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 20px;
    left: ${props =>
        `calc(${props.sidebarOpened ? props.sidebarWidth : '0px'} + 20px)`
    };
    & > *:not(:last-child) {
        margin-bottom: 10px;
    }
    transition-duration: 0.2s;
`;

type RoundButtonsGroupProps = {
    sidebarWidth: string;
    sidebarOpened: boolean;
    children?: React.ReactNode;
};

const RoundButtonsGroup = (props: RoundButtonsGroupProps) => {
    return (
        <Wrapper
            sidebarWidth={props.sidebarWidth}
            sidebarOpened={props.sidebarOpened}
        >{props.children}</Wrapper>
    );
};

export default RoundButtonsGroup;