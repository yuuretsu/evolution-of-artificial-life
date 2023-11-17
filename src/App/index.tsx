import {
  enabledGenesToPool,
  getInitiallyEnabledGenesNames
} from 'lib/genome';
import { throttle } from 'lib/helpers';
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
import { FlexColumn, WideButton, Window } from 'ui';

import { Controls } from './Controls';
import { SafeAreaBottom } from './SafeAreaBottom';
import { Sidebar } from './Sidebar';
import { Viewer } from './Viewer';
import { GameImage } from './Viewer/GameImage';
import { GlobalStyles } from './app.css';

import type {
  VisualiserParams
} from 'lib/view-modes';
import type {
  NewWorldProps,
  World, WorldInfo
} from 'lib/world';
import type { FC } from 'react';

const initialEnabledGenes = getInitiallyEnabledGenesNames();

const initialGenePool = enabledGenesToPool(initialEnabledGenes);

const initWidth = Math.max(Math.floor(window.innerWidth / PIXEL_SIZE) + 2, 10);
const initHeight = Math.max(Math.floor(window.innerHeight / PIXEL_SIZE) + 2, 10);

const INIT_WORLD_PROPS: NewWorldProps = {
  width: initWidth,
  height: initHeight,
  botsAmount: initWidth * initHeight,
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
  const [isDrag, setIsDrag] = useState(true);

  const currentViewMode = VIEW_MODES[appStore.viewModeName.current]!;


  const updateWorldView = useCallback(
    throttle(() => {
      setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
      setWorldInfo(world.getInfo());
    }, 1000 / 60),
    [world, currentViewMode.blockToColor, visualizerParams]
  );

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
    appStore.selectedBlock.set(null);
    appStore.imageOffset.set({ x: 0, y: 0 });
  };

  const onClickPixel = useCallback((x: number, y: number) => {
    if (!isDrag) return;
    appStore.selectedBlock.set(world.get(x, y) || null);
  }, [world, isDrag]);

  const onMoveImage = (x: number, y: number) => {
    appStore.imageOffset.set({ x, y });
  };

  const handleCancelImageMove = useCallback(() => {
    setTimeout(() => setIsDrag(true));
  }, []);

  return (
    <>
      <GlobalStyles />
      <SafeAreaBottom />
      <Wrapper ref={appRef} style={{ height: `${appHeight}px` }}>
        <Viewer
          position={appStore.imageOffset.current}
          onMove={onMoveImage}
          onStart={() => setIsDrag(false)}
          onCancel={handleCancelImageMove}
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
        <Window title='Инфо о блоке'>
          {appStore.selectedBlock.current ? (
            <FlexColumn gap={10}>
              <WideButton onClick={() => appStore.selectedBlock.set(null)}>Снять выделение</WideButton>
              <appStore.selectedBlock.current.Render />
            </FlexColumn>
          ) : (
            <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
          )}
        </Window>
      </Wrapper>
    </>
  );
});
