import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`;

const HeadWrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    width: 100%;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.25em;
    margin-bottom: 10px;
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
    defaultOpened?: boolean
};

const Accordion = (props: AccordionProps) => {
    const [opened, setOpened] = React.useState(props.defaultOpened);
    return (
        <Wrapper>
            <HeadWrapper onClick={() => setOpened(!opened)}>
                {props.name}
                <MdKeyboardArrowDown
                    style={{
                        transform: opened ? 'none' : 'rotate(-90deg)',
                        transitionDuration: '0.2s',
                        minWidth: '25px',
                        minHeight: '25px',
                        marginLeft: '20px'
                    }}
                />
            </HeadWrapper>
            {opened && <BodyWrapper>{props.children}</BodyWrapper>}
        </Wrapper>
    );
}

export default Accordion;