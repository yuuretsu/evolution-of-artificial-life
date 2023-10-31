import { observer } from 'mobx-react';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import { FlexColumn } from 'ui';
import { SIDEBAR_PADDING } from 'settings';
import { type FC } from 'react';

import { SimulationSpeedRange } from './SimulationSpeedRange';
import { ControlsButtons } from './ControlsButtons';

import type { IControlsButtonsProps } from './ControlsButtons';

const Wrapper = styled.div<{ isTransparent: boolean }>`
  position: fixed;
  display: flex;
  background-color: rgba(40, 40, 40, 0.8);
  backdrop-filter: blur(20px);
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 0 50px 0 rgba(0, 0, 0, 1);
  bottom: calc(${SIDEBAR_PADDING} + env(safe-area-inset-bottom));
  right: calc(${SIDEBAR_PADDING} + env(safe-area-inset-right));
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
`;

export interface IControlsProps {
  controlsButtonsProps: IControlsButtonsProps;
}

export const Controls: FC<IControlsProps> = observer(({ controlsButtonsProps }) => {
  return (
    <Wrapper isTransparent={!sidebarStore.isOpen}>
      <FlexColumn gap={10}>
        <SimulationSpeedRange />

        <ControlsButtons
          onClickStep={controlsButtonsProps.onClickStep}
          onClickRestart={controlsButtonsProps.onClickRestart}
          fullscreenElement={controlsButtonsProps.fullscreenElement}
        />
      </FlexColumn>
    </Wrapper>
  );
});
