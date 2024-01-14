import { useUnit } from 'effector-react';
import { Legend } from 'widgets/legend';
import { $selectedBlock } from 'entities/selected-block';
import { $isSidebarOpen } from 'entities/sidebar';
import { selectWorldBlock } from 'features/select-world-block';
import { setSidebarIsOpen } from 'features/set-sidebar-is-open';
import { useEffect, useRef } from 'react';
import { createToggleStore } from 'shared/lib/helpers';
import { useAccordionToggle } from 'shared/lib/hooks';
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING, SIDEBAR_WIDTH } from 'shared/settings';
import { hideScrollbar, panel } from 'shared/styles';
import {
  Accordion,
  Br,
  FlexColumn,
  WideButton
} from 'shared/ui';
import styled from 'styled-components';
import { SetEnabledGenes } from 'features/set-enabled-genes';
import { StartNewWorld } from 'features/start-new-world/ui';
import { WorldInfo } from 'entities/world';
import { Footer } from 'widgets/footer';
import { SetViewOptions } from 'features/set-view-options';

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

export const Sidebar: FC = () => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
    setSidebarIsOpen,
    selectWorldBlock,
    selectedBlock: $selectedBlock,
  });

  const worldBlockInfoAccordionProps = useAccordionToggle(
    worldBlockInfoAccordionState.$isEnabled,
    worldBlockInfoAccordionState.toggle
  );

  const currentWorldSettingsAccordionProps = useAccordionToggle(
    currentWorldSettingsAccordionState.$isEnabled,
    currentWorldSettingsAccordionState.toggle
  );

  const restartWorldAccordionProps = useAccordionToggle(
    restartWorldAccordionState.$isEnabled,
    restartWorldAccordionState.toggle
  );

  const worldInfoAccordionProps = useAccordionToggle(
    worldInfoAccordionState.$isEnabled,
    worldInfoAccordionState.toggle
  );

  const viewSettingsAccordionProps = useAccordionToggle(
    viewSettingsAccordionState.$isEnabled,
    viewSettingsAccordionState.toggle
  );

  const deselectBlock = () => u.selectWorldBlock(null);

  const worldBlockInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!u.selectedBlock || !worldBlockInfoRef.current) return;
    worldBlockInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    worldBlockInfoAccordionState.open();
    setSidebarIsOpen(true);
  }, [u.selectedBlock]);

  return (
    <Wrapper isOpen={u.isSidebarOpen}>
      <FlexColumn gap={20}>
        <Legend />
        <Accordion name='Инфо о мире' {...worldInfoAccordionProps}>
          <WorldInfo />
        </Accordion>
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
        {/* <ViewSettings
          visualizerParams={props.visualizerParams}
          setVisualizerParams={props.setVisualizerParams}
        /> */}
        <Accordion name='Настройки просмотра' {...viewSettingsAccordionProps}>
          <SetViewOptions />
        </Accordion>
        <Accordion name='Настройки мира' {...currentWorldSettingsAccordionProps}>
          <SetEnabledGenes />
        </Accordion>
        <Accordion name='Перезапуск' {...restartWorldAccordionProps}>
          <StartNewWorld />
        </Accordion>
        <Br />
        <Footer />
      </FlexColumn>
    </Wrapper>
  );
};

const worldBlockInfoAccordionState = createToggleStore(true);
const currentWorldSettingsAccordionState = createToggleStore(true);
const restartWorldAccordionState = createToggleStore(true);
const worldInfoAccordionState = createToggleStore(true);
const viewSettingsAccordionState = createToggleStore(true);
