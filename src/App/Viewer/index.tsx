import { observer } from "mobx-react";
import React, { useState } from "react";
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_WIDTH } from "settings";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import { useEventListener } from "usehooks-ts";

const Wrapper = styled.div<{ isSidebarOpen: boolean, isDragging: boolean }>`
  touch-action: none;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-left: ${props => props.isSidebarOpen ? SIDEBAR_WIDTH : '0px'};
  cursor: ${props => props.isDragging ? "grabbing" : "default"};
  transition-duration: ${SIDEBAR_ANIMATION_SPEED};
`;

export interface IVec2 {
  x: number;
  y: number;
}

export interface IViewerProps {
  position: IVec2;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
};

const Viewer: React.FC<IViewerProps> = observer(props => {
  const [initPos, setInitPos] = useState({ x: 0, y: 0 });
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [isDraggingNow, setIsDraggingNow] = useState(isDraggingActive);
  const [initialBodyUserSelect, setInitialBodyUserSelect] = useState(document.body.style.userSelect);
  const imageOffset = props.position;

  const onCancel = () => {
    setIsDraggingActive(false);
    document.body.style.userSelect = initialBodyUserSelect;
    setIsDraggingNow(false);
  };

  const onStart = () => {
    setInitialBodyUserSelect(document.body.style.userSelect);
    document.body.style.userSelect = "none";
    setIsDraggingActive(true);
  };

  useEventListener("mousemove", (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.clientX - initPos.x, e.clientY - initPos.y);
    setIsDraggingNow(true);
  });

  useEventListener("touchmove", (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.touches[0]!.clientX - initPos.x, e.touches[0]!.clientY - initPos.y);
  });

  useEventListener("mouseup", onCancel);
  useEventListener("touchend", onCancel);

  return (
    <Wrapper
      isDragging={isDraggingNow}
      isSidebarOpen={sidebarStore.isOpen}
      onMouseDown={e => {
        setInitPos({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
        onStart();
      }}
      onTouchStart={e => {
        setInitPos({
          x: e.touches[0]!.clientX - imageOffset.x,
          y: e.touches[0]!.clientY - imageOffset.y
        });
        onStart();
      }}
    >
      <div style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }}>
        {props.children}
      </div>
    </Wrapper>
  );
});

export default Viewer;