import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING, SIDEBAR_WIDTH } from 'settings';
import { accordionsStates } from 'stores/accordions';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import {
  Accordion,
  Br,
  FlexColumn,
  WideButton
} from 'ui';
import { hideScrollbar, panel } from 'App/app.css';

import { CurrentWorldSettings } from './components/CurrentWorldSettings';
import { Legend } from './components/Legend';
import { NewWorldForm } from './components/NewWorldForm';
import { ViewSettings } from './components/ViewSettings';
import { WorldInformation } from './components/WorldInfo';
import { Footer } from './components/Footer';

import type { VisualiserParams } from 'lib/view-modes';
import type { NewWorldProps, World, WorldInfo } from 'lib/world';
import type { FC } from 'react';
import type { WorldBlock } from 'types';

interface ISidebarProps {
  readonly isOpen: boolean,
}

const Wrapper = styled.div<ISidebarProps>`
  --padding-bottom: calc(${SIDEBAR_PADDING} * 2 + 80px + env(safe-area-inset-bottom));
  position: fixed;
  right: ${props => props.isOpen ? 0 : `calc(-${SIDEBAR_WIDTH} - ${SIDEBAR_PADDING} * 2 - env(safe-area-inset-left))`};
  box-sizing: content-box;
  width: ${SIDEBAR_WIDTH};
  min-width: ${SIDEBAR_WIDTH};
  height: calc(100% - var(--padding-bottom) - ${SIDEBAR_PADDING});
  overflow-y: auto;
  padding-top: ${SIDEBAR_PADDING};
  padding-right: calc(${SIDEBAR_PADDING} + env(safe-area-inset-right));
  padding-bottom: var(--padding-bottom);
  padding-left: ${SIDEBAR_PADDING};
  color: whitesmoke;
  box-shadow: ${props => props.isOpen ? '0 0 10px 0 rgba(0, 0, 0, 0.5)' : 'none'};
  transition-duration: ${SIDEBAR_ANIMATION_SPEED};
  ${panel};
  ${hideScrollbar};
`;

type SidebarProps = {
  visualizerParams: VisualiserParams,
  setVisualizerParams: (value: VisualiserParams) => void;
  newWorldProps: NewWorldProps,
  setNewWorldProps: (value: NewWorldProps) => void
  world: World,
  worldInfo: WorldInfo,
  enabledGenes: Record<string, boolean>
  setEnabledGenes: (value: Record<string, boolean>) => void;
  selectedBlock: WorldBlock | null;
  setSelectedBlock: (block: WorldBlock | null) => void;
  onClickRestart: () => void;
};

export const Sidebar: FC<SidebarProps> = observer((props) => {
  const deselectBlock = () => props.setSelectedBlock(null);

  const worldBlockInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!props.selectedBlock || !worldBlockInfoRef.current) return;
    worldBlockInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    accordionsStates.states.worldBlockInfo.setTrue();
    sidebarStore.open();
  }, [props.selectedBlock]);

  return (
    <Wrapper isOpen={sidebarStore.isOpen}>
      <FlexColumn gap={20}>
        <Legend />
        <WorldInformation
          cycle={props.worldInfo.cycle}
          botsAmount={props.worldInfo.dynamicBlocks}
          stepTime={props.worldInfo.stepTime}
          averageAge={props.worldInfo.averageAge}
          maxGeneration={props.worldInfo.maxGeneration}
        />
        <Accordion
          name='Инфо о блоке'
          ref={worldBlockInfoRef}
          style={{ scrollMargin: SIDEBAR_PADDING }}
          {...accordionsStates.getProps('worldBlockInfo')}
        >
          {props.selectedBlock ? (
            <FlexColumn gap={10}>
              <WideButton onClick={deselectBlock}>Снять выделение</WideButton>
              <props.selectedBlock.Render />
            </FlexColumn>
          ) : (
            <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
          )}
        </Accordion>
        <ViewSettings
          visualizerParams={props.visualizerParams}
          setVisualizerParams={props.setVisualizerParams}
        />
        <CurrentWorldSettings
          enabledGenes={props.enabledGenes}
          onChangeEnabledGenes={props.setEnabledGenes}
        />
        <NewWorldForm
          newWorldProps={props.newWorldProps}
          maxBotsAmount={props.world.width * props.world.height}
          setNewWorldProps={props.setNewWorldProps}
          onClickRestart={props.onClickRestart}
        />
        <Br />
        <Footer />
      </FlexColumn>
    </Wrapper>
  );
});
