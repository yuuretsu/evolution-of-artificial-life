import { observer } from "mobx-react";
import React, { useState } from "react";
import { SIDEBAR_WIDTH } from "settings";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';

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
  const [initPos, setInitPos] = useState(props.position);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const imageOffset = props.position;

  const onCancel = () => setIsDraggingActive(false);

  return (
    <Wrapper
      isSidebarOpen={sidebarStore.isOpen}
      onMouseDown={e => {
        setInitPos({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
        setIsDraggingActive(true);
      }}
      onTouchStart={e => {
        setInitPos({
          x: e.touches[0]!.clientX - imageOffset.x,
          y: e.touches[0]!.clientY - imageOffset.y
        });
        setIsDraggingActive(true);
      }}
      onMouseMove={e => {
        if (!isDraggingActive) return;
        e.preventDefault();
        props.onMove(e.clientX - initPos.x, e.clientY - initPos.y);
      }}
      onTouchMove={e => {
        if (!isDraggingActive) return;
        e.preventDefault();
        props.onMove(e.touches[0]!.clientX - initPos.x, e.touches[0]!.clientY - initPos.y);
      }}
      onMouseUp={onCancel}
      onTouchEnd={onCancel}
    >
      <div style={{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }}>
        {props.children}
      </div>
    </Wrapper>
  );
});

export default Viewer;