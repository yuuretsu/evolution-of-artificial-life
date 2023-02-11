import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { SIDEBAR_WIDTH } from "settings";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import { WorldBlock } from "lib/block";
import { World } from "lib/world";
import GameImage from "./GameImage";

interface IViewerProps {
    readonly isSidebarOpen: boolean;
}

const Wrapper = styled.div<IViewerProps>`
    touch-action: none;
    display: flex;
    top: 0;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow: visible;
    margin-left: ${props => props.isSidebarOpen ? SIDEBAR_WIDTH : '0px'};
    transition-duration: 0.2s;
`;

type ViewerProps = {
    image: HTMLCanvasElement,
    world: World
    onClickPixel: (block: WorldBlock | null) => void;
};

const Viewer = observer((props: ViewerProps) => {
    const [initPos, setInitPos] = useState({ x: 0, y: 0 });
    const [draggingActive, setDraggingActive] = useState(false);
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setCurrentPos({ x: 0, y: 0 });
        setImageOffset({ x: 0, y: 0 });
    }, [props.world]);

    return (
        <Wrapper
            isSidebarOpen={sidebarStore.isOpen}
            onMouseDown={e => {
                setInitPos({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
                setDraggingActive(true);
            }}
            onTouchStart={e => {
                setInitPos({
                    x: e.touches[0]!.clientX - imageOffset.x,
                    y: e.touches[0]!.clientY - imageOffset.y
                });
                setDraggingActive(true);
            }}
            onMouseMove={e => {
                if (draggingActive) {
                    e.preventDefault();
                    setCurrentPos({ x: e.clientX - initPos.x, y: e.clientY - initPos.y });
                    setImageOffset(currentPos);
                }
            }}
            onTouchMove={e => {
                if (draggingActive) {
                    e.preventDefault();
                    setCurrentPos({
                        x: e.touches[0]!.clientX - initPos.x,
                        y: e.touches[0]!.clientY - initPos.y
                    });
                    setImageOffset(currentPos);
                }
            }}
            onMouseUp={() => {
                setInitPos(currentPos);
                setDraggingActive(false);
            }}
            onTouchEnd={() => {
                setInitPos(currentPos);
                setDraggingActive(false);
            }}
        >
            <GameImage
                offset={currentPos}
                image={props.image}
                onClickPixel={props.onClickPixel}
                world={props.world}
            />
        </Wrapper>
    );
});

export default Viewer;