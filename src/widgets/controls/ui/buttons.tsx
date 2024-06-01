import { IconContext } from 'react-icons';
import { FlexRow } from 'shared/ui';
import styled from 'styled-components';

import { TogglePlayPause } from './toggle-play-pause';
import { MakeSimulationStep } from './make-simulation-step';
import { Restart } from './restart';
import { ToggleFullscreen } from './toggle-fullscreen';
import { ToggleSidebar } from './toggle-sidebar';

import type { FC } from 'react';

const Divider = styled.div`
  background-color: rgb(80, 80, 80);
  width: 2.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`;

export interface IControlsButtonsProps {
  onClickStep: () => void;
  fullscreenElement?: HTMLElement | null;
}

export const ControlsButtons: FC<IControlsButtonsProps> = ({ onClickStep, fullscreenElement }) => {
  const isCanFullscreen = !!fullscreenElement?.requestFullscreen;

  return (
    <FlexRow gap={10}>
      <IconContext.Provider value={{ size: '25px', color: 'whitesmoke' }}>
        <TogglePlayPause />
        <MakeSimulationStep onClickStep={onClickStep} />
        <Restart />
        {isCanFullscreen && (
          <>
            <Divider />
            <ToggleFullscreen />
          </>
        )}
        <Divider />
        <ToggleSidebar />
      </IconContext.Provider>
    </FlexRow>
  );
};
