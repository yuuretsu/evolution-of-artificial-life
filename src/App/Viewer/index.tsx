import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { SIDEBAR_WIDTH } from "settings";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import { World } from "lib/world";

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

export interface IViewerProps {
  world: World
  children: React.ReactNode;
};

const Viewer: React.FC<IViewerProps> = observer(props => {
  const [initPos, setInitPos] = useState({ x: 0, y: 0 });
  const [draggingActive, setDraggingActive] = useState(false);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentPos({ x: 0, y: 0 });
    setImageOffset({ x: 0, y: 0 });
  }, [props.world]);

  const onCancel = () => {
    setInitPos(currentPos);
    setDraggingActive(false);
  };

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