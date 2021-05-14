import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { keyframes } from "styled-components";

interface IWrapper {
    readonly small: boolean | undefined;
}

const Wrapper = styled.div<IWrapper>`
    &:not(:last-child) {
        margin-bottom: ${props => props.small ? 10 : 20}px;
    }
`;

interface IHeadWrapper {
    readonly small: boolean | undefined,
}

const HeadWrapper = styled.div<IHeadWrapper>`
    box-sizing: border-box;
    display: flex;
    width: 100%;
    text-transform: ${props => props.small ? 'none' : 'uppercase'};
    font-weight: bold;
    font-size: ${props => props.small ? 'inherit' : '1.25em'};
    margin-bottom: ${props => props.small ? '5px' : '10px'};
    border-left: 5px solid rgb(80, 80, 80);
    padding-left: 10px;
    justify-content: space-between;
    cursor: pointer;
    /* align-items: center; */
    user-select: none;
`;

const anim = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: none;
    }
`;

const BodyWrapper = styled.div`
    animation: ${anim} 0.2s;
`;

type AccordionProps = {
    name: string;
    children?: React.ReactNode,
    defaultOpened?: boolean,
    small?: boolean
};

const Accordion = (props: AccordionProps) => {
    const [opened, setOpened] = React.useState(props.defaultOpened);
    return (
        <Wrapper small={props.small}>
            <HeadWrapper onClick={() => setOpened(!opened)} small={props.small}>
                {props.name}
                <MdKeyboardArrowDown
                    style={{
                        transform: opened ? 'none' : 'rotate(-90deg)',
                        transitionDuration: '0.2s',
                        minWidth: props.small ? '20px' : '25px',
                        minHeight: props.small ? '20px' : '25px',
                        marginLeft: props.small ? '10px' : '20px'
                    }}
                />
            </HeadWrapper>
            {opened && <BodyWrapper>{props.children}</BodyWrapper>}
        </Wrapper>
    );
}

export default Accordion;