import styled from 'styled-components';
import { FlexColumn } from 'shared/ui';
import { SIDEBAR_PADDING } from 'shared/settings';
import { type FC } from 'react';
import { TimeBetweenUpdatesRange } from 'features/set-time-between-updates';
import { panel } from 'shared/styles';
import { useUnit } from 'effector-react';
import { $isSidebarOpen } from 'entities/sidebar';
import { useMouseActivity } from 'shared/lib/hooks';

import { ControlsButtons } from './buttons';

import type { IControlsButtonsProps } from './buttons';


const Wrapper = styled.div<{ isShow: boolean }>`
  position: fixed;
  display: flex;
  ${panel}
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  bottom: ${({ isShow }) => isShow ? `calc(${SIDEBAR_PADDING} + env(safe-area-inset-bottom));` : '10px'};
  right: calc(${SIDEBAR_PADDING} + env(safe-area-inset-right));
  opacity: ${({ isShow }) => isShow ? 1 : 0};
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
`;

export interface IControlsProps {
  controlsButtonsProps: IControlsButtonsProps;
}

export const Controls: FC<IControlsProps> = ({ controlsButtonsProps }) => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
  });

  const isMouseActive = useMouseActivity(10000);

  return (
    <Wrapper isShow={isMouseActive || u.isSidebarOpen}>
      <FlexColumn gap={10}>
        <TimeBetweenUpdatesRange />

        <ControlsButtons
          onClickStep={controlsButtonsProps.onClickStep}
          fullscreenElement={controlsButtonsProps.fullscreenElement}
        />
      </FlexColumn>
    </Wrapper>
  );
};
