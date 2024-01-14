import { useUnit } from 'effector-react';
import { $enabledGenes } from 'entities/enabled-genes';
import { $isPaused } from 'entities/play-pause';
import { $selectedBlock } from 'entities/selected-block';
import { $world, $worldInfo, updateWorldInfo } from 'entities/world';
import { pause } from 'features/play-pause';
import { selectWorldBlock } from 'features/select-world-block';
import { throttle } from 'lib/helpers';
import {
  VIEW_MODES,
  initVisualizerParams
} from 'lib/view-modes';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useInterval } from 'usehooks-ts';
import { useWindowInnerHeight } from 'lib/hooks';
import { $viewMode } from 'entities/view-mode';
import { $minTimeBetweenUpdates } from 'entities/min-time-between-updates/model';

import { Controls } from './Controls';
import { SafeAreaBottom } from './SafeAreaBottom';
import { Sidebar } from './Sidebar';
import { Viewer } from './Viewer';
import { GameImage } from './Viewer/GameImage';
import { GlobalStyles } from './app.css';

import type {
  VisualiserParams
} from 'lib/view-modes';
import type { FC } from 'react';


const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

export const App: FC = observer(() => {
  const appRef = useRef<HTMLDivElement>(null);

  const u = useUnit({
    minTimeBetweenUpdates: $minTimeBetweenUpdates,
    isPaused: $isPaused,
    world: $world,
    enabledGenes: $enabledGenes,
    selectWorldBlock,
    selectedBlock: $selectedBlock,
    worldInfo: $worldInfo,
    updateWorldInfo,
    viewModeName: $viewMode
  });

  const appHeight = useWindowInnerHeight();
  const [visualizerParams, setVisualizerParams] = useState<VisualiserParams>(initVisualizerParams);
  const [image, setImage] = useState<HTMLCanvasElement>(u.world.toImage(() => null, visualizerParams));
  const [isDrag, setIsDrag] = useState(true);

  const currentViewMode = VIEW_MODES[u.viewModeName]!;


  const updateWorldView = useCallback(
    throttle(() => {
      setImage(u.world.toImage(currentViewMode.blockToColor, visualizerParams));
      updateWorldInfo();
    }, 1000 / 60),
    [u.world, currentViewMode.blockToColor, visualizerParams]
  );

  const step = () => {
    if (!isDrag) return;
    u.world.step();
    updateWorldView();
  };

  useEffect(updateWorldView, [currentViewMode.blockToColor, u.world, visualizerParams]);

  useInterval(step, u.isPaused ? null : u.minTimeBetweenUpdates);

  const onClickStep = () => {
    u.isPaused
      ? step()
      : pause();
  };

  const onClickPixel = useCallback((x: number, y: number) => {
    if (!isDrag) return;
    u.selectWorldBlock(u.world.get(x, y) || null);
  }, [u.world, isDrag]);

  const handleCancelImageMove = useCallback(() => {
    setTimeout(() => setIsDrag(true));
  }, []);

  return (
    <>
      <GlobalStyles />
      <SafeAreaBottom />
      <Wrapper ref={appRef} style={{ height: `${appHeight}px` }}>
        <Viewer
          onStart={() => setIsDrag(false)}
          onCancel={handleCancelImageMove}
        >
          <GameImage image={image} onClickPixel={onClickPixel} />
        </Viewer>
        <Sidebar
          visualizerParams={visualizerParams}
          setVisualizerParams={setVisualizerParams}
        />
        {!!appRef.current && (
          <Controls
            controlsButtonsProps={{
              onClickStep,
              fullscreenElement: appRef.current,
            }}
          />
        )}
      </Wrapper>
    </>
  );
});
