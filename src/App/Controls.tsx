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
import { appStore } from 'stores/app';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import { CircleButton, CIRCLE_BUTTON_ICON_STYLE } from 'ui';

import type { FC } from 'react';

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  background-color: #282828;
  padding: 10px;
  border-radius: 100px;
  box-shadow: 0 0 10px 0 black;
  bottom: calc(20px + env(safe-area-inset-bottom));
  left: 20px;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
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
    <Wrapper>
      <CircleButton title="Настройки" onClick={sidebarStore.toggle}>
        {sidebarStore.isOpen
          ? <MdClose style={CIRCLE_BUTTON_ICON_STYLE} />
          : <MdMenu style={CIRCLE_BUTTON_ICON_STYLE} />}
      </CircleButton>
      <CircleButton
        title={appStore.isPaused ? 'Продолжить' : 'Пауза'}
        onClick={appStore.toggleIsPaused}
      >
        <PlayPauseIcon style={CIRCLE_BUTTON_ICON_STYLE} />
      </CircleButton>
      <CircleButton
        title="Шаг симуляции"
        onClick={props.onClickStep}
      >
        <MdSkipNext style={CIRCLE_BUTTON_ICON_STYLE} />
      </CircleButton>
      <CircleButton
        title="Рестарт"
        onClick={props.onClickRestart}
      >
        <MdReplay style={CIRCLE_BUTTON_ICON_STYLE} />
      </CircleButton>
      {isCanFullscreen && (
        <CircleButton
          title="Fullscreen"
          onClick={onClickFullscreen}
        >
          <FullscreenIcon style={CIRCLE_BUTTON_ICON_STYLE} />
        </CircleButton>
      )}
    </Wrapper>
  );
});
