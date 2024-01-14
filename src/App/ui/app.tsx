import { useUnit } from 'effector-react';
import { $enabledGenes } from 'entities/enabled-genes';
import { $isPaused } from 'entities/play-pause';
import { $selectedBlock } from 'entities/selected-block';
import { $world, $worldInfo, updateWorldInfo } from 'entities/world';
import { pause } from 'features/play-pause';
import { selectWorldBlock } from 'features/select-world-block';
import { $minTimeBetweenUpdates } from 'features/set-time-between-updates';
import { $viewMode } from 'features/set-view-options';
import { $visualizerParams } from 'features/set-view-options/model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'shared/lib/helpers';
import { useWindowInnerHeight } from 'shared/lib/hooks';
import {
  VIEW_MODES,
} from 'shared/lib/view-modes';
import styled from 'styled-components';
import { useInterval } from 'usehooks-ts';
import { Controls } from 'widgets/controls';

import { Viewer } from './Viewer';
import { GameImage } from './Viewer/GameImage';
import { GlobalStyles } from './global-styles';
import { SafeAreaBottom } from './safe-area-bottom';
import { Sidebar } from './sidebar';

import type { FC } from 'react';


const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

export const App: FC = () => {
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
    viewModeName: $viewMode,
    visualizerParams: $visualizerParams
  });

  const appHeight = useWindowInnerHeight();
  const [image, setImage] = useState<HTMLCanvasElement>(u.world.toImage(() => null, u.visualizerParams));
  const [isDrag, setIsDrag] = useState(true);

  const currentViewMode = VIEW_MODES[u.viewModeName]!;


  const updateWorldView = useCallback(
    throttle(() => {
      setImage(u.world.toImage(currentViewMode.blockToColor, u.visualizerParams));
      updateWorldInfo();
    }, 1000 / 60),
    [u.world, currentViewMode.blockToColor, u.visualizerParams]
  );

  const step = () => {
    if (!isDrag) return;
    u.world.step();
    updateWorldView();
  };

  useEffect(updateWorldView, [currentViewMode.blockToColor, u.world, u.visualizerParams]);

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
        <Sidebar />
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
};
