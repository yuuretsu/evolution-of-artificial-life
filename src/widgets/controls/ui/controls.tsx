import styled from 'styled-components';
import { FlexColumn } from 'ui';
import { SIDEBAR_PADDING } from 'settings';
import { type FC } from 'react';
import { panel } from 'app/app.css';
import { TimeBetweenUpdatesRange } from 'features/set-time-between-updates';

import { ControlsButtons } from './buttons';

import type { IControlsButtonsProps } from './buttons';


const Wrapper = styled.div`
  position: fixed;
  display: flex;
  ${panel}
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
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

export const Controls: FC<IControlsProps> = ({ controlsButtonsProps }) => {
  return (
    <Wrapper>
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
