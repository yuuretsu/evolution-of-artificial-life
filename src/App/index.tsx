import {
  enabledGenesToPool,
  getInitiallyEnabledGenesNames
} from 'lib/genome';
import {
  VIEW_MODES,
  initVisualizerParams
} from 'lib/view-modes';
import {
  SquareWorld
} from 'lib/world';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PIXEL_SIZE } from 'settings';
import { appStore } from 'stores/app';
import styled from 'styled-components';
import { useEventListener, useInterval } from 'usehooks-ts';

import { Controls } from './Controls';
import { Sidebar } from './Sidebar';
import { Viewer } from './Viewer';
import { GameImage } from './Viewer/GameImage';
import { SafeAreaBottom } from './SafeAreaBottom';
import { GlobalStyles } from './app.css';

import type {
  VisualiserParams
} from 'lib/view-modes';
import type {
  NewWorldProps,
  World, WorldInfo
} from 'lib/world';
import type { FC } from 'react';
import type { WorldBlock } from 'types';

const initialEnabledGenes = getInitiallyEnabledGenesNames();

const initialGenePool = enabledGenesToPool(initialEnabledGenes);

const INIT_WORLD_PROPS: NewWorldProps = {
  width: Math.max(Math.floor(window.innerWidth / PIXEL_SIZE) + 2, 10),
  height: Math.max(Math.floor(window.innerHeight / PIXEL_SIZE) + 2, 10),
  botsAmount: 500,
  genePool: initialGenePool,
  genomeSize: 32,
};

const initWorld = new SquareWorld(INIT_WORLD_PROPS);
const initWorldInfo = initWorld.getInfo();
const initWorldImage = initWorld.toImage(() => null, initVisualizerParams);

const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

export const App: FC = observer(() => {
  const appRef = useRef<HTMLDivElement>(null);
  const [appHeight, setAppHeight] = useState(window.innerHeight);
  const updateAppHeight = () => setAppHeight(window.innerHeight);
  const [visualizerParams, setVisualizerParams] = useState<VisualiserParams>(initVisualizerParams);
  const [newWorldProps, setNewWorldProps] = useState<NewWorldProps>(INIT_WORLD_PROPS);
  const [world, setWorld] = useState<World>(initWorld);
  const [image, setImage] = useState<HTMLCanvasElement>(initWorldImage);
  const [worldInfo, setWorldInfo] = useState<WorldInfo>(initWorldInfo);
  const [enabledGenes, setEnabledGenes] = useState(initialEnabledGenes);
  const [selectedBlock, setSelectedBlock] = useState<WorldBlock | null>(null);
  const [isDrag, setIsDrag] = useState(true);

  const currentViewMode = VIEW_MODES[appStore.viewModeName.current]!;

  const updateWorldView = () => {
    setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
    setWorldInfo(world.getInfo());
  };

  const step = () => {
    if (!isDrag) return;
    world.step();
    updateWorldView();
  };

  useEventListener('resize', updateAppHeight);
  useEventListener('orientationchange', updateAppHeight);

  useEffect(updateWorldView, [currentViewMode.blockToColor, world, visualizerParams]);

  useEffect(() => {
    const newGenePool = enabledGenesToPool(enabledGenes);
    setNewWorldProps({
      ...newWorldProps,
      ...{ genePool: newGenePool }
    });
    world.genePool = newGenePool;
  }, [enabledGenes]);

  useInterval(step, appStore.isPaused ? null : appStore.timeBetweenSteps.current);

  const onClickStep = () => {
    appStore.isPaused
      ? step()
      : appStore.pause();
  };

  const restart = () => {
    setWorld(new SquareWorld(newWorldProps));
    setSelectedBlock(null);
    appStore.imageOffset.set({ x: 0, y: 0 });
  };

  const onClickPixel = useCallback((x: number, y: number) => {
    if (!isDrag) return;
    setSelectedBlock(world.get(x, y) || null);
  }, [world, isDrag]);

  const onMoveImage = (x: number, y: number) => {
    appStore.imageOffset.set({ x, y });
  };

  return (
    <>
      <GlobalStyles />
      <SafeAreaBottom />
      <Wrapper ref={appRef} style={{ height: `${appHeight}px` }}>
        <Viewer
          position={appStore.imageOffset.current}
          onMove={onMoveImage}
          onStart={() => setIsDrag(false)}
          onCancel={() => setTimeout(() => setIsDrag(true))}
        >
          <GameImage image={image} onClickPixel={onClickPixel} />
        </Viewer>
        <Sidebar
          visualizerParams={visualizerParams}
          setVisualizerParams={setVisualizerParams}
          newWorldProps={newWorldProps}
          setNewWorldProps={setNewWorldProps}
          world={world}
          worldInfo={worldInfo}
          enabledGenes={enabledGenes}
          setEnabledGenes={setEnabledGenes}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          onClickRestart={restart}
        />
        {!!appRef.current && (
          <Controls
            controlsButtonsProps={{
              onClickStep,
              onClickRestart: restart,
              fullscreenElement: appRef.current,
            }}
          />
        )}
      </Wrapper>
    </>
  );
});
