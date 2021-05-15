import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { WorldBlock } from "../../../lib/block";
import Rgba from "../../../lib/color";
import VIEW_MODES from "../../../lib/view-modes";
import { World } from "../../../lib/world";

const animation = keyframes`
    0% {
        transform: scale(0.9);
    }

    100% {
        transform: scale(1);
    }
`;

const Wrapper = styled.canvas`
    background-color: rgb(5, 5, 5);
    border: 2px solid rgb(20, 20, 20);
    border-radius: 5px;
    animation: ${animation} 0.2s ease;
`;


type GameImageProps = {
    paused: boolean;
    offset: { x: number, y: number },
    image: HTMLCanvasElement,
    viewMode: keyof typeof VIEW_MODES;
    setSelectedBlock: (block: WorldBlock | null) => any;
    world: World
};

const GameImage = (props: GameImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) setCtx(canvasRef.current.getContext('2d'));
    }, [canvasRef]);

    useEffect(() => {
        if (canvasRef.current && ctx) {
            canvasRef.current.width = props.image.width * 8;
            canvasRef.current.height = props.image.height * 8;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(props.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [ctx, props.image]);

    return (
        <Wrapper
            ref={canvasRef}
            style={{ transform: `translate(${props.offset.x}px, ${props.offset.y}px)` }}
            onClick={(e) => {
                const rect = canvasRef.current!.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / 8);
                const y = Math.floor((e.clientY - rect.top) / 8);
                const block = props.world.get(x, y);
                console.log(block, x, y);
                props.setSelectedBlock(block ? block : null);
            }}
        />
    );
};

export default GameImage;