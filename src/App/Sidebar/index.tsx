import { useEffect, useRef } from 'react';
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING, SIDEBAR_WIDTH } from 'settings';
import styled from 'styled-components';
import {
  Accordion,
  Br,
  FlexColumn,
  WideButton
} from 'ui';
import { hideScrollbar, panel } from 'app/app.css';
import { useAccordionToggle, useThrottle } from 'lib/hooks';
import { useUnit } from 'effector-react';
import { selectWorldBlock } from 'features/select-world-block';
import { $selectedBlock } from 'entities/selected-block';
import { $isSidebarOpen } from 'entities/sidebar';
import { setSidebarIsOpen } from 'features/set-sidebar-is-open';
import { $worldInfo } from 'entities/world';
import { createToggleStore } from 'lib/helpers';

import { CurrentWorldSettings } from './components/CurrentWorldSettings';
import { Legend } from './components/Legend';
import { NewWorldForm } from './components/NewWorldForm';
import { ViewSettings } from './components/ViewSettings';
import { WorldInformation } from './components/WorldInfo';
import { Footer } from './components/Footer';

import type { VisualiserParams } from 'lib/view-modes';
import type { FC } from 'react';

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
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
    setSidebarIsOpen,
    selectWorldBlock,
    selectedBlock: $selectedBlock,
    worldInfo: $worldInfo
  });

  const worldBlockInfoAccordionProps = useAccordionToggle(
    worldBlockInfoAccordionState.$isEnabled,
    worldBlockInfoAccordionState.toggle
  );

  const deselectBlock = () => u.selectWorldBlock(null);

  const worldBlockInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!u.selectedBlock || !worldBlockInfoRef.current) return;
    worldBlockInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    worldBlockInfoAccordionState.open();
    setSidebarIsOpen(true);
  }, [u.selectedBlock]);

  const worldInformationProps = useThrottle({
    cycle: u.worldInfo.cycle,
    botsAmount: u.worldInfo.dynamicBlocks,
    averageAge: u.worldInfo.averageAge,
    stepTime: u.worldInfo.stepTime,
    maxGeneration: u.worldInfo.maxGeneration,
  }, 100);

  return (
    <Wrapper isOpen={u.isSidebarOpen}>
      <FlexColumn gap={20}>
        <Legend />
        <WorldInformation {...worldInformationProps} />
        <Accordion
          name='Инфо о блоке'
          ref={worldBlockInfoRef}
          style={{ scrollMargin: SIDEBAR_PADDING }}
          {...worldBlockInfoAccordionProps}
        >
          {u.selectedBlock ? (
            <FlexColumn gap={10}>
              <WideButton onClick={deselectBlock}>Снять выделение</WideButton>
              <u.selectedBlock.Render />
            </FlexColumn>
          ) : (
            <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
          )}
        </Accordion>
        <ViewSettings
          visualizerParams={props.visualizerParams}
          setVisualizerParams={props.setVisualizerParams}
        />
        <CurrentWorldSettings />
        <NewWorldForm />
        <Br />
        <Footer />
      </FlexColumn>
    </Wrapper>
  );
};

const worldBlockInfoAccordionState = createToggleStore(true);
