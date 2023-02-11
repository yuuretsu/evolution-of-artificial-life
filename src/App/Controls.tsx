import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { MdClose, MdMenu, MdPause, MdPlayArrow, MdSkipNext } from 'react-icons/md';
import { appStore } from 'stores/app';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import { CircleButton, CIRCLE_BUTTON_ICON_STYLE } from './CircleButton';

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  background-color: #282828;
  padding: 10px;
  border-radius: 100px;
  box-shadow: 0 0 10px 0 black;
  top: 20px;
  left: 20px;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  transition-duration: 0.2s;
`;

export interface IControlsProps {
  onClickStep: () => void;
}

export const Controls: FC<IControlsProps> = observer((props) => {
  return (
    <Wrapper>
      <CircleButton title="Настройки" onClick={sidebarStore.toggle}>
        {sidebarStore.isOpen
          ? <MdClose style={CIRCLE_BUTTON_ICON_STYLE} />
          : <MdMenu style={CIRCLE_BUTTON_ICON_STYLE} />}
      </CircleButton>
      <CircleButton
        title={appStore.isPaused ? "Продолжить" : "Пауза"}
        onClick={appStore.toggleIsPaused}
      >
        {appStore.isPaused
          ? <MdPlayArrow style={CIRCLE_BUTTON_ICON_STYLE} />
          : <MdPause style={CIRCLE_BUTTON_ICON_STYLE} />}
      </CircleButton>
      <CircleButton
        title="Шаг симуляции"
        onClick={props.onClickStep}
      >
        <MdSkipNext style={CIRCLE_BUTTON_ICON_STYLE} />
      </CircleButton>
    </Wrapper>
  )
});
