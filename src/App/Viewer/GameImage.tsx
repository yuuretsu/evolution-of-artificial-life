import { memo, useEffect, useRef } from 'react';
import { PIXEL_SIZE } from 'settings';
import styled, { keyframes } from 'styled-components';

import type { FC } from 'react';

const animation = keyframes`
  from {
    transform: scale(0.9);
  }
`;

const Wrapper = styled.canvas`
  display: block;
  background-color: rgb(5, 5, 5);
  border: 2px solid rgb(20, 20, 20);
  border-radius: 5px;
  animation: ${animation} 0.2s ease;
`;


type GameImageProps = {
  image: CanvasImageSource & { width: number, height: number },
  onClickPixel: (x: number, y: number) => void;
};

export const GameImage: FC<GameImageProps> = memo((props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const width = props.image.width * PIXEL_SIZE;
  const height = props.image.height * PIXEL_SIZE;

  useEffect(() => {
    const cnv = canvasRef.current;
    const ctx = cnv?.getContext('2d');
    if (!cnv || !ctx) return;
    cnv.width = width * devicePixelRatio;
    cnv.height = height * devicePixelRatio;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(props.image, 0, 0, cnv.width, cnv.height);
  }, [props.image]);

  return (
    <Wrapper
      style={{ width, height }}
      ref={canvasRef}
      onClick={(e) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
        props.onClickPixel(x, y);
      }}
    />
  );
});
