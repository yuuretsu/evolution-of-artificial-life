import { observer } from 'mobx-react';
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
import { IconContext } from 'react-icons';
import { appStore } from 'stores/app';
import { sidebarStore } from 'stores/sidebar';
import styled, { css } from 'styled-components';
import { CircleButton } from 'ui';
import { SIDEBAR_PADDING } from 'settings';

import type { FC } from 'react';

const Wrapper = styled.div<{ isTransparent: boolean }>`
  position: fixed;
  display: flex;
  ${({ isTransparent }) => {
    return css`
      background-color: ${isTransparent ? 'rgba(40, 40, 40, 0.8)' : 'rgb(40, 40, 40)'};
      backdrop-filter: blur(20px);
    `;
  }}
  padding: 10px;
  border-radius: 100px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
  bottom: calc(${SIDEBAR_PADDING} + env(safe-area-inset-bottom));
  right: calc(${SIDEBAR_PADDING} + env(safe-area-inset-right));
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
`;

const Divider = styled.div`
  background-color: rgb(80, 80, 80);
  width: 2.5px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`;

export interface IControlsProps {
  onClickStep: () => void;
  onClickRestart: () => void;
  fullscreenElement?: HTMLElement | null;
}

export const Controls: FC<IControlsProps> = observer((props) => {
  const PlayPauseIcon = appStore.isPaused ? MdPlayArrow : MdPause;

  const { fullscreenElement: fullscreen } = props;
  const isCanFullscreen = !!fullscreen?.requestFullscreen;
  const isInfullscreen = document.fullscreenElement === fullscreen;

  const onClickFullscreen = () => isInfullscreen
    ? document.exitFullscreen()
    : fullscreen?.requestFullscreen?.();

  const FullscreenIcon = isInfullscreen ? MdFullscreenExit : MdFullscreen;

  return (
    <IconContext.Provider value={{ size: '25px', color: 'whitesmoke' }}>

      <Wrapper isTransparent={!sidebarStore.isOpen}>
        <CircleButton
          title={appStore.isPaused ? 'Продолжить' : 'Пауза'}
          onClick={appStore.toggleIsPaused}
        >
          <PlayPauseIcon />
        </CircleButton>
        <CircleButton
          title="Шаг симуляции"
          onClick={props.onClickStep}
        >
          <MdSkipNext />
        </CircleButton>
        <CircleButton
          title="Рестарт"
          onClick={props.onClickRestart}
        >
          <MdReplay />
        </CircleButton>
        {isCanFullscreen && (
          <>
            <Divider />
            <CircleButton
              title="Fullscreen"
              onClick={onClickFullscreen}
            >
              <FullscreenIcon />
            </CircleButton>
          </>
        )}
        <Divider />
        <CircleButton title="Настройки" onClick={sidebarStore.toggle}>
          {sidebarStore.isOpen
            ? <MdClose />
            : <MdMenu />}
        </CircleButton>
      </Wrapper>
    </IconContext.Provider>
  );
});
