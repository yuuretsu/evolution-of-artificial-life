import { observer } from 'mobx-react';
import { IconContext } from 'react-icons';
import { appStore } from 'stores/app';
import { sidebarStore } from 'stores/sidebar';
import { CircleButton, FlexRow } from 'ui';
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

import type { FC } from 'react';

export interface IControlsButtonsProps {
  onClickStep: () => void;
  onClickRestart: () => void;
  fullscreenElement?: HTMLElement | null;
}

export const ControlsButtons: FC<IControlsButtonsProps> = observer(({ onClickStep, onClickRestart, fullscreenElement }) => {
  const isCanFullscreen = !!fullscreenElement?.requestFullscreen;
  const isInFullscreen = document.fullscreenElement === fullscreenElement;
  const onClickFullscreen = () => isInFullscreen
    ? document.exitFullscreen()
    : fullscreenElement?.requestFullscreen?.();

  const IconPlayPause = appStore.isPaused ? MdPlayArrow : MdPause;
  const IconSidebarOpenClose = sidebarStore.isOpen ? MdClose : MdMenu;

  const IconFullscreen = isInFullscreen ? MdFullscreenExit : MdFullscreen;

  return (
    <FlexRow gap={10}>
      <IconContext.Provider value={{ size: '25px', color: 'whitesmoke' }}>
        <CircleButton
          title={appStore.isPaused ? 'Продолжить' : 'Пауза'}
          onClick={appStore.toggleIsPaused}
        >
          <IconPlayPause />
        </CircleButton>
        <CircleButton title="Шаг симуляции" onClick={onClickStep}>
          <MdSkipNext />
        </CircleButton>
        <CircleButton title="Рестарт" onClick={onClickRestart}>
          <MdReplay />
        </CircleButton>
        {isCanFullscreen && (
          <>
            <Divider />
            <CircleButton title="Fullscreen" onClick={onClickFullscreen}>
              <IconFullscreen />
            </CircleButton>
          </>
        )}
        <Divider />
        <CircleButton title="Настройки" onClick={sidebarStore.toggle}>
          <IconSidebarOpenClose />
        </CircleButton>
      </IconContext.Provider>
    </FlexRow>
  );
});

const Divider = styled.div`
  background-color: rgb(80, 80, 80);
  width: 2.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`;
