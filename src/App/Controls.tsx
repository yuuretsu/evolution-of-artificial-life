import { World } from 'lib/world';
import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { MdClose, MdMenu, MdPause, MdPlayArrow, MdSkipNext } from 'react-icons/md';
import { sidebarStore } from 'stores/sidebar';
import styled from 'styled-components';
import RoundButton, { ROUND_BUTTON_ICON_STYLE } from './RoundButton';

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
  world: World
  isPaused: boolean;
  onClickPlayPause: () => void;
  onClickStep: () => void;
}

const Controls: FC<IControlsProps> = observer((props) => {
  return (
    <Wrapper>
      <RoundButton title="Настройки" onClick={sidebarStore.toggle}>
        {sidebarStore.isOpen
          ? <MdClose style={ROUND_BUTTON_ICON_STYLE} />
          : <MdMenu style={ROUND_BUTTON_ICON_STYLE} />}
      </RoundButton>
      <RoundButton
        title="Пауза / продолжить"
        onClick={props.onClickPlayPause}
      >
        {props.isPaused
          ? <MdPlayArrow style={ROUND_BUTTON_ICON_STYLE} />
          : <MdPause style={ROUND_BUTTON_ICON_STYLE} />}
      </RoundButton>
      <RoundButton
        title="Шаг симуляции"
        onClick={props.onClickStep}
      >
        <MdSkipNext style={ROUND_BUTTON_ICON_STYLE} />
      </RoundButton>
    </Wrapper>
  )
});

export default Controls;