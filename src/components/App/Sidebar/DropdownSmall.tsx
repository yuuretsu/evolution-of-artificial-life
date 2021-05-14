import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
    position: relative;
`;

const Header = styled.div`
    box-sizing: border-box;
    font-weight: bold;
    display: flex;
    width: 100%;
    /* justify-content: space-between; */
    cursor: pointer;
    /* border: 1px solid rgba(255, 255, 255, 0.1); */
    transition-duration: 0.2s;
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        padding-left: 5px;
        border-radius: 2px;
    }
    &:focus {
        background-color: rgba(255, 255, 255, 0.1);
        padding-left: 5px;
        border-radius: 2px;
        outline: none;
        border: none;
    }
`;

const anim = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

const Body = styled.div`
    z-index: 999;
    box-sizing: border-box;
    position: absolute;
    background-color: #282828;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.5);
    width: 100%;
    animation: ${anim} 0.2s;
`;

const Select = styled.div`
    padding: 2px 5px;
    cursor: pointer;
    &:hover {
        background-color: #505050;
    }
`;

const DropdownSmall: React.FC<{
    name: string,
    list: { value: string, title: string }[],
    onChange: (value: string) => any
}> = (props) => {
    const [opened, setOpened] = React.useState(false);
    return (
        <Wrapper>
            <Header
                onClick={() => setOpened(!opened)}
                style={{
                    padding: opened ? '10px' : '0',
                }}
            >
                {props.name}
                <MdKeyboardArrowDown
                    style={{
                        minWidth: '15px',
                        minHeight: '15px',
                        transform: 'translateY(3px)',
                        marginLeft: '5px',
                    }}
                />
            </Header>
            {opened && <Body>
                {props.list.map(value => {
                    return (
                        <Select
                            key={value.value}
                            onClick={e => {
                                setOpened(false);
                                props.onChange(value.value);
                            }}
                        >
                            {value.title}
                        </Select>
                    );
                })}
            </Body>}
        </Wrapper>
    );
};

export default DropdownSmall;