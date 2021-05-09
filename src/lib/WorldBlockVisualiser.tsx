import React from "react";
import styled from 'styled-components';
import { WorldBlock } from "./block";

const Wrapper = styled.div`
    width: 10px;
    height: 10px;
    border: 1px solid whitesmoke;
    border-radius: 2px;
`;

type WorldBlockIcon = { block: WorldBlock };

const WorldBlockIcon = (props: WorldBlockIcon) => {
    const maybeColor = props.block.getNormalColor();
    const color = maybeColor ? maybeColor.toString() : 'transparent';
    return (
        <Wrapper style={{ backgroundColor: color }} />
    );
}

export default WorldBlockIcon;