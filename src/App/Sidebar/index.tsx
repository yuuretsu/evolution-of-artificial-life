import { WorldBlock } from "lib/block";
import { GENES } from "lib/genome";
import { viewModesList, VisualiserParams } from "lib/view-modes";
import { NewWorldProps, World, WorldInfo } from "lib/world";
import { observer } from "mobx-react";
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING, SIDEBAR_WIDTH } from "settings";
import { appStore } from "stores/app";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import {
  Accordion,
  Checkbox,
  FlexColumn,
  InputRange,
  OptionalBlock,
  Radio,
  SubBlock,
  WideButton
} from "ui";
import { NewWorldForm } from "./components/NewWorldForm";
import { Legend } from "./components/Legend";
import { WorldInformation } from "./components/WorldInfo";
import { ViewSettings } from "./components/ViewSettings";

interface ISidebarProps {
  readonly opened: boolean,
};

const Wrapper = styled.div<ISidebarProps>`
  position: fixed;
  left: ${props => props.opened ? 0 : `-${SIDEBAR_WIDTH}`};
  box-sizing: border-box;
  width: ${SIDEBAR_WIDTH};
  min-width: ${SIDEBAR_WIDTH};
  height: 100%;
  overflow-y: auto;
  padding: calc(${SIDEBAR_PADDING} * 2 + 55px) ${SIDEBAR_PADDING} 0 ${SIDEBAR_PADDING};
  background-color: rgba(20, 20, 20, 0.99);
  color: whitesmoke;
  box-shadow: ${props => props.opened ? '0 0 10px 0 rgba(0, 0, 0, 1)' : 'none'};
  transition-duration: ${SIDEBAR_ANIMATION_SPEED};
  &::after {
    content: "";
    display: block;
    padding-bottom: ${SIDEBAR_PADDING};
  }
  /* &::-webkit-scrollbar {
    width: 6px;
    background-color: rgb(15, 15, 15);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(50, 50, 50);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(80, 80, 80);
  } */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

type SidebarProps = {
  visualizerParams: VisualiserParams,
  setVisualizerParams: (value: VisualiserParams) => void;
  newWorldProps: NewWorldProps,
  setNewWorldProps: (value: NewWorldProps) => void
  onChangeWorld: (world: World) => void,
  world: World,
  worldInfo: WorldInfo,
  enabledGenes: { [name: string]: boolean }
  setEnabledGenes: (value: { [name: string]: boolean }) => void;
  selectedBlock: WorldBlock | null;
  setSelectedBlock: (block: WorldBlock | null) => void;
  onClickRestart: () => void;
};

const Sidebar = observer((props: SidebarProps) => {
  const enableDefaultGenes = () => {
    const entries = Object.entries(props.enabledGenes);
    const resultEntries = entries.map(([k]) => [k, !!GENES[k]?.defaultEnabled]);
    props.setEnabledGenes(Object.fromEntries(resultEntries))
  };

  const disableAllGenes = () => {
    props.setEnabledGenes(Object.fromEntries(Object.entries(props.enabledGenes).map(([k]) => [k, false])))
  };

  const deselectBlock = () => props.setSelectedBlock(null);

  return (
    <Wrapper opened={sidebarStore.isOpen}>
      <FlexColumn gap={20}>
        <Legend />
        <WorldInformation
          cycle={props.worldInfo.cycle}
          botsAmount={props.worldInfo.dynamicBlocks}
          stepTime={props.worldInfo.stepTime}
        />
        <Accordion name='Инфо о блоке' defaultOpened>
          {props.selectedBlock ? (
            <FlexColumn gap={10}>
              <WideButton onClick={deselectBlock}>Снять выделение</WideButton>
              <props.selectedBlock.Render />
            </FlexColumn>
          ) : (
            <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
          )}
        </Accordion>
        <ViewSettings
          visualizerParams={props.visualizerParams}
          setVisualizerParams={props.setVisualizerParams}
        />
        <Accordion name='Настройки мира' defaultOpened>
          <SubBlock name="Генофонд">
            <FlexColumn gap={10}>
              <FlexColumn gap={5}>
                {Object.keys(props.enabledGenes).map(key => {
                  return (
                    <Checkbox
                      title={GENES[key]!.name}
                      value={key}
                      key={key}
                      checked={props.enabledGenes[key]}
                      onChange={(value, checked) => {
                        const newEnabledGenes = { ...props.enabledGenes };
                        newEnabledGenes[value] = checked;
                        props.setEnabledGenes(newEnabledGenes)
                      }}
                    />
                  )
                })}
              </FlexColumn>
              <FlexColumn gap={5}>
                <WideButton onClick={enableDefaultGenes}>
                  Вернуть стандартные
                </WideButton>
                <WideButton onClick={disableAllGenes}>
                  Выключить все
                </WideButton>
              </FlexColumn>
            </FlexColumn>
          </SubBlock>
        </Accordion>
        <NewWorldForm
          newWorldProps={props.newWorldProps}
          maxBotsAmount={props.world.width * props.world.height}
          setNewWorldProps={props.setNewWorldProps}
          onClickRestart={props.onClickRestart}
        />
      </FlexColumn>
    </Wrapper>
  );
});

export default Sidebar;