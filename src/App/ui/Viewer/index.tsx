import { useUnit } from 'effector-react';
import { $imageOffset, setImageOffset } from 'entities/image-offset';
import { debounce } from 'shared/lib/helpers';
import { useCallback, useState } from 'react';
import { SIDEBAR_ANIMATION_SPEED } from 'shared/settings';
import styled from 'styled-components';
import { useEventListener } from 'usehooks-ts';

const Wrapper = styled.div<{ isDragging: boolean }>`
  touch-action: none;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-left: env(safe-area-inset-left);
  cursor: ${props => props.isDragging ? 'grabbing' : 'default'};
  transition-duration: ${SIDEBAR_ANIMATION_SPEED};
`;

export interface IVec2 {
  x: number;
  y: number;
}

export interface IViewerProps {
  onStart?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
};

export const Viewer: React.FC<IViewerProps> = (props => {
  const { imageOffset } = useUnit({
    imageOffset: $imageOffset,
  });

  const [initPos, setInitPos] = useState({ x: 0, y: 0 });
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [isDraggingNow, setIsDraggingNow] = useState(isDraggingActive);
  const [initialBodyUserSelect, setInitialBodyUserSelect] = useState(document.body.style.userSelect);

  const start = () => {
    setIsDraggingActive(true);
    setInitialBodyUserSelect(document.body.style.userSelect);
    document.body.style.userSelect = 'none';
  };

  const cancel = () => {
    setIsDraggingActive(false);
    setIsDraggingNow(false);
    props.onCancel?.();
    document.body.style.userSelect = initialBodyUserSelect;
  };

  const createMoveHandler = <T extends Event,>(getPointsFromEvent: (e: T) => IVec2[]) => {
    return (e: T) => {
      if (!isDraggingActive) return;
      e.preventDefault();
      const { x: cx, y: cy } = getMiddlePoint(getPointsFromEvent(e));
      setImageOffset({ x: cx - initPos.x, y: cy - initPos.y });
      setIsDraggingNow(true);
      props.onStart?.();
    };
  };

  useEventListener('mousemove', createMoveHandler(e => [{ x: e.clientX, y: e.clientY }]));
  useEventListener('touchmove', createMoveHandler(e => [...e.touches].map(x => ({ x: x!.clientX, y: x!.clientY }))));

  useEventListener('mouseup', cancel);
  useEventListener('touchend', cancel);

  const onCancelDebounced = useCallback(debounce(props.onCancel, 100), [props.onCancel]);

  return (
    <Wrapper
      isDragging={isDraggingNow}
      onMouseDown={e => {
        if (e.button !== 1) return;
        setInitPos({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
        start();
      }}
      onTouchStart={e => {
        setInitPos({
          x: e.touches[0]!.clientX - imageOffset.x,
          y: e.touches[0]!.clientY - imageOffset.y
        });
        start();
      }}
      onWheel={e => {
        props.onStart?.();
        setImageOffset({ x: imageOffset.x - e.deltaX, y: imageOffset.y - e.deltaY });
        onCancelDebounced();
      }}
    >
      <div style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }}>
        {props.children}
      </div>
    </Wrapper>
  );
});

const getMiddlePoint = (points: IVec2[]): IVec2 => {
  const { x, y } = points.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
  return { x: x / points.length, y: y / points.length };
};
