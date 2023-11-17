import { debounce } from 'lib/helpers';
import { observer } from 'mobx-react';
import { useCallback, useState } from 'react';
import { SIDEBAR_ANIMATION_SPEED } from 'settings';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import { useEventListener } from 'usehooks-ts';

const Wrapper = styled.div<{ isSidebarOpen: boolean, isDragging: boolean }>`
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
  position: IVec2;
  onMove: (x: number, y: number) => void;
  onStart?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
};

export const Viewer: React.FC<IViewerProps> = observer(props => {
  const [initPos, setInitPos] = useState({ x: 0, y: 0 });
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [isDraggingNow, setIsDraggingNow] = useState(isDraggingActive);
  const [initialBodyUserSelect, setInitialBodyUserSelect] = useState(document.body.style.userSelect);
  const imageOffset = props.position;

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

  useEventListener('mousemove', (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.clientX - initPos.x, e.clientY - initPos.y);
    setIsDraggingNow(true);
    props.onStart?.();
  });

  useEventListener('touchmove', (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.touches[0]!.clientX - initPos.x, e.touches[0]!.clientY - initPos.y);
    setIsDraggingNow(true);
    props.onStart?.();
  });

  useEventListener('mouseup', cancel);
  useEventListener('touchend', cancel);

  const onCancelDebounced = useCallback(debounce(props.onCancel, 100), [props.onCancel]);

  return (
    <Wrapper
      isDragging={isDraggingNow}
      isSidebarOpen={sidebarStore.isOpen}
      onMouseDown={e => {
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
        props.onMove(imageOffset.x - e.deltaX, imageOffset.y - e.deltaY);
        onCancelDebounced();
      }}
    >
      <div style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }}>
        {props.children}
      </div>
    </Wrapper>
  );
});
