import { IconContext } from 'react-icons';
import { FlexRow } from 'shared/ui';
import {
  MdClose,
  MdMenu,
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdReplay,
  MdFullscreen,
  MdFullscreenExit
} from 'react-icons/md';
import styled from 'styled-components';
import { useUnit } from 'effector-react';
import { startNewWorldWithCurrentParameters } from 'features/start-new-world';
import { toggleIsPlaying } from 'features/play-pause';
import { $isPaused } from 'entities/play-pause';
import { $isSidebarOpen } from 'entities/sidebar';
import { setSidebarIsOpen } from 'features/set-sidebar-is-open';


import { RoundedButton } from './rounded-button';
import { RoundedToggle } from './rounded-toggle';

import type { FC } from 'react';

export interface IControlsButtonsProps {
  onClickStep: () => void;
  fullscreenElement?: HTMLElement | null;
}

export const ControlsButtons: FC<IControlsButtonsProps> = ({ onClickStep, fullscreenElement }) => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
    setSidebarIsOpen,
    isPaused: $isPaused,
    startNewWorldWithCurrentParameters,
    toggleIsPlaying
  });

  const isCanFullscreen = !!fullscreenElement?.requestFullscreen;
  const isInFullscreen = document.fullscreenElement === fullscreenElement;
  const onClickFullscreen = () => isInFullscreen
    ? document.exitFullscreen()
    : fullscreenElement?.requestFullscreen?.();

  return (
    <FlexRow gap={10}>
      <IconContext.Provider value={{ size: '25px', color: 'whitesmoke' }}>
        <RoundedToggle
          title={u.isPaused ? 'Возобновить' : 'Пауза'}
          slotA={<MdPlayArrow />}
          slotB={<MdPause />}
          isA={u.isPaused}
          onChange={u.toggleIsPlaying}
        />
        <RoundedButton title="Шаг симуляции" onClick={onClickStep}>
          <MdSkipNext />
        </RoundedButton>
        <RoundedButton title="Рестарт" onClick={u.startNewWorldWithCurrentParameters}>
          <MdReplay />
        </RoundedButton>
        {isCanFullscreen && (
          <>
            <Divider />
            <RoundedToggle
              title={isInFullscreen ? 'Выход из полноэкранного режима' : 'Полноэкранный режим'}
              slotA={<MdFullscreen />}
              slotB={<MdFullscreenExit />}
              isA={!isInFullscreen}
              onChange={onClickFullscreen}
            />
          </>
        )}
        <Divider />
        <RoundedToggle
          title="Настройки"
          slotA={<MdClose />}
          slotB={<MdMenu />}
          isA={u.isSidebarOpen}
          onChange={u.setSidebarIsOpen}
        />
      </IconContext.Provider>
    </FlexRow>
  );
};

const Divider = styled.div`
  background-color: rgb(80, 80, 80);
  width: 2.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`;
