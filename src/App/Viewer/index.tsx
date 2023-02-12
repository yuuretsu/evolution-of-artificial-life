import { observer } from "mobx-react";
import React, { useState } from "react";
import { SIDEBAR_WIDTH } from "settings";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import { useEventListener } from "usehooks-ts";

const Wrapper = styled.div<{ isSidebarOpen: boolean }>`
  touch-action: none;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-left: ${props => props.isSidebarOpen ? SIDEBAR_WIDTH : '0px'};
  transition-duration: 0.2s;
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
  const [initialBodyUserSelect, setInitialBodyUserSelect] = useState(document.body.style.userSelect);
  const imageOffset = props.position;

  const onCancel = () => {
    setIsDraggingActive(false);
    document.body.style.userSelect = initialBodyUserSelect;
  };

  useEventListener("mouseup", onCancel);
  useEventListener("touchend", onCancel);

  useEventListener("mousemove", (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.clientX - initPos.x, e.clientY - initPos.y);
  });

  useEventListener("touchmove", (e) => {
    if (!isDraggingActive) return;
    e.preventDefault();
    props.onMove(e.touches[0]!.clientX - initPos.x, e.touches[0]!.clientY - initPos.y);
  });

  return (
    <Wrapper
      isSidebarOpen={sidebarStore.isOpen}
      onMouseDown={e => {
        setInitPos({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
        setInitialBodyUserSelect(document.body.style.userSelect);
        document.body.style.userSelect = "none";
        setIsDraggingActive(true);
      }}
      onTouchStart={e => {
        setInitPos({
          x: e.touches[0]!.clientX - imageOffset.x,
          y: e.touches[0]!.clientY - imageOffset.y
        });
        setInitialBodyUserSelect(document.body.style.userSelect);
        document.body.style.userSelect = "none";
        setIsDraggingActive(true);
      }}
    >
      <div style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }}>
        {props.children}
      </div>
    </Wrapper>
  );
});

export default Viewer;