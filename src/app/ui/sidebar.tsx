import { useUnit } from 'effector-react';
import { Legend } from 'widgets/legend';
import { $selectedBlock } from 'entities/selected-block';
import { $isSidebarOpen } from 'entities/sidebar';
import { selectWorldBlock } from 'features/select-world-block';
import { setSidebarIsOpen } from 'features/set-sidebar-is-open';
import { useEffect, useRef, type FC } from 'react';
import { createToggleStore } from 'shared/lib/helpers';
import { useAccordionToggle } from 'shared/lib/hooks';
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING_X, SIDEBAR_PADDING_Y, SIDEBAR_WIDTH } from 'shared/settings';
import { hideScrollbar, panel } from 'shared/styles';
import { Accordion, Br, FlexColumn, WideButton } from 'shared/ui';
import styled from 'styled-components';
import { SetEnabledGenes } from 'features/set-enabled-genes';
import { StartNewWorld } from 'features/start-new-world/ui';
import { WorldInfo } from 'entities/world';
import { Footer } from 'widgets/footer';
import { SetViewOptions } from 'features/set-view-options';

interface ISidebarProps {
  readonly $isOpen: boolean;
}

const Wrapper = styled.div<ISidebarProps>`
  --padding-bottom: calc(${SIDEBAR_PADDING_Y} * 2 + 80px + env(safe-area-inset-bottom));
  
  position: fixed;
  top: 0;
  right: 0;
  transform: ${props => props.$isOpen ? 'translateX(0)' : `translateX(calc(100% - ${SIDEBAR_PADDING_X}))`};
  
  box-sizing: border-box;
  width: calc(${SIDEBAR_WIDTH} + ${SIDEBAR_PADDING_X} * 4);
  min-width: ${SIDEBAR_WIDTH};
  height: calc(100%);
  
  padding: ${SIDEBAR_PADDING_Y} ${SIDEBAR_PADDING_X};
  padding-right: calc(${SIDEBAR_PADDING_X} + env(safe-area-inset-right));
  padding-bottom: var(--padding-bottom);
  
  color: whitesmoke;
  overflow-y: auto;
  transition: all ${SIDEBAR_ANIMATION_SPEED} ease-in-out;

  ${hideScrollbar};
`;

const SidebarInner = styled(FlexColumn) <ISidebarProps>`
  box-shadow: ${props => props.$isOpen ? '0 0 10px 0 rgba(0, 0, 0, 0.5)' : 'none'};
  padding: ${SIDEBAR_PADDING_Y} ${SIDEBAR_PADDING_X};
  border-radius: 20px;
  ${panel};
`;

export const Sidebar: FC = () => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
    setSidebarIsOpen,
    selectWorldBlock,
    selectedBlock: $selectedBlock,
  });

  const worldInfoAccordionProps = useAccordionToggle(worldInfoAccordionState.$isEnabled, worldInfoAccordionState.toggle);
  const worldBlockInfoAccordionProps = useAccordionToggle(worldBlockInfoAccordionState.$isEnabled, worldBlockInfoAccordionState.toggle);
  const viewSettingsAccordionProps = useAccordionToggle(viewSettingsAccordionState.$isEnabled, viewSettingsAccordionState.toggle);
  const currentWorldSettingsAccordionProps = useAccordionToggle(currentWorldSettingsAccordionState.$isEnabled, currentWorldSettingsAccordionState.toggle);
  const restartWorldAccordionProps = useAccordionToggle(restartWorldAccordionState.$isEnabled, restartWorldAccordionState.toggle);

  const worldBlockInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!u.selectedBlock || !worldBlockInfoRef.current) return;
    worldBlockInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    worldBlockInfoAccordionState.open();
    u.setSidebarIsOpen(true);
  }, [u.selectedBlock, u.setSidebarIsOpen]);

  return (
    <Wrapper $isOpen={u.isSidebarOpen}>
      <SidebarInner gap={20} $isOpen={u.isSidebarOpen}>
        <Legend />

        <Accordion name="Инфо о мире" {...worldInfoAccordionProps}>
          <WorldInfo />
        </Accordion>

        <Accordion
          name="Инфо о блоке"
          ref={worldBlockInfoRef}
          style={{ scrollMargin: SIDEBAR_PADDING_Y }}
          {...worldBlockInfoAccordionProps}
        >
          {u.selectedBlock ? (
            <FlexColumn gap={10}>
              <WideButton onClick={() => u.selectWorldBlock(null)}>Снять выделение</WideButton>
              <u.selectedBlock.Render />
            </FlexColumn>
          ) : (
            <span>Кликните по пикселю на карте, чтобы увидеть информацию.</span>
          )}
        </Accordion>

        <Accordion name="Настройки просмотра" {...viewSettingsAccordionProps}>
          <SetViewOptions />
        </Accordion>

        <Accordion name="Настройки мира" {...currentWorldSettingsAccordionProps}>
          <SetEnabledGenes />
        </Accordion>

        <Accordion name="Перезапуск" {...restartWorldAccordionProps}>
          <StartNewWorld />
        </Accordion>

        <Br />
        <Footer />
      </SidebarInner>
    </Wrapper>
  );
};

const worldBlockInfoAccordionState = createToggleStore(true);
const currentWorldSettingsAccordionState = createToggleStore(true);
const restartWorldAccordionState = createToggleStore(true);
const worldInfoAccordionState = createToggleStore(true);
const viewSettingsAccordionState = createToggleStore(true);