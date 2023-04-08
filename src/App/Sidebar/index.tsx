import { observer } from "mobx-react";
import { appStore } from "stores/app";
import { sidebarStore } from "stores/sidebar";
import styled from 'styled-components';
import { WorldBlock } from "lib/block";
import Rgba from "lib/color";
import { GENES } from "lib/genome";
import { limit } from "lib/helpers";
import { viewModesList, VisualiserParams } from "lib/view-modes";
import { World, WorldInfo, NewWorldProps } from "lib/world";
import { SIDEBAR_ANIMATION_SPEED, SIDEBAR_PADDING, SIDEBAR_WIDTH } from "settings";
import Accordion from "./Accordion";
import Checkbox from "./Checkbox";
import InputNumber from "./InputNumber";
import InputRange from "./InputRange";
import OptionalBlock from "./OptionalBlock";
import RadioGroup from "./RadioGroup";
import SubBlock from "./SubBlock";
import WideButton from "./WideButton";

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

  return (
    <Wrapper opened={sidebarStore.isOpen}>
      <Accordion name='Легенда'>
        {Object.entries(GENES)
          .filter(([, geneTemplate]) => typeof geneTemplate.description === "string")
          .map(([key, geneTemplate]) =>
            <Accordion
              key={key}
              name={geneTemplate.name}
              color={geneTemplate.color?.interpolate(new Rgba(127, 127, 127, 255), 0.5).toString()}
              small
            >
              {geneTemplate.description}
            </Accordion>
          )}
      </Accordion>
      <Accordion name='Инфо о мире' defaultOpened>
        <div>Возраст: {(props.worldInfo.cycle / 1000).toFixed(1)} тыс. кадров</div>
        <div>Ботов: {props.worldInfo.dynamicBlocks}</div>
        <div>Время обработки: {props.worldInfo.stepTime.toFixed(1)} мс.</div>
      </Accordion>
      <Accordion name='Инфо о блоке' defaultOpened>
        {props.selectedBlock
          ? <>
            <SubBlock>
              <WideButton onClick={() => props.setSelectedBlock(null)}>Снять выделение</WideButton>
            </SubBlock>
            <props.selectedBlock.Render />
          </>
          : <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
        }
      </Accordion>
      <Accordion name='Настройки просмотра' defaultOpened>
        <SubBlock name={`Время между обновлениями`}>
          <InputRange
            min={1}
            max={200}
            value={appStore.timeBetweenSteps.current}
            onChange={e => appStore.timeBetweenSteps.set(+e.target.value)}
          />
        </SubBlock>
        <SubBlock name="Режим отображения">
          <RadioGroup
            name='view-mode'
            list={viewModesList}
            defaultChecked={appStore.viewModeName.current}
            onChange={appStore.viewModeName.set}
          />
        </SubBlock>
        {appStore.viewModeName.current === 'age' && <OptionalBlock>
          <SubBlock name="Делитель возраста">
            <InputRange
              min={10}
              max={1000}
              value={props.visualizerParams.ageDivider}
              onChange={e => props.setVisualizerParams({
                ...props.visualizerParams,
                ...{ ageDivider: parseInt(e.target.value) }
              })}
            />
          </SubBlock>
        </OptionalBlock>}
        {appStore.viewModeName.current === 'energy' && <OptionalBlock>
          <SubBlock name="Делитель энергии">
            <InputRange
              min={1}
              max={500}
              value={props.visualizerParams.energyDivider}
              onChange={e => props.setVisualizerParams({
                ...props.visualizerParams,
                ...{ energyDivider: parseInt(e.target.value) }
              })}
            />
          </SubBlock>
        </OptionalBlock>}
        {appStore.viewModeName.current === 'lastAction' && <OptionalBlock>
          <SubBlock name="Отображение отдельных действий">
            {
              Object
                .keys(props.visualizerParams.action)
                .map(actionName => {
                  return (
                    <Checkbox
                      title={actionName}
                      value={actionName}
                      key={actionName}
                      checked={props.visualizerParams.action[actionName]}
                      onChange={(value, checked) => {
                        const newParams = {
                          ...props.visualizerParams,
                        };
                        newParams.action[value] = checked;
                        props.setVisualizerParams(newParams);
                      }}
                    />
                  );
                })
            }
          </SubBlock>
          <WideButton
            onClick={() => {
              const newParams = {
                ...props.visualizerParams,
              };
              Object
                .keys(newParams.action)
                .forEach(name => {
                  newParams.action[name] = true;
                });
              props.setVisualizerParams(newParams);
            }}
          >
            Включить все
          </WideButton>
          <WideButton
            onClick={() => {
              const newParams = {
                ...props.visualizerParams,
              };
              Object
                .keys(newParams.action)
                .forEach(name => {
                  newParams.action[name] = false;
                });
              props.setVisualizerParams(newParams);
            }}
          >
            Выключить все
          </WideButton>
        </OptionalBlock>}
      </Accordion>
      <Accordion name='Настройки мира' defaultOpened>
        <SubBlock name="Генофонд">
          {Object.keys(props.enabledGenes).map(key => {
            return (<Checkbox
              title={GENES[key]!.name}
              value={key}
              key={key}
              checked={props.enabledGenes[key]}
              onChange={(value, checked) => {
                const newEnabledGenes = { ...props.enabledGenes };
                newEnabledGenes[value] = checked;
                props.setEnabledGenes(newEnabledGenes)
              }}
            />)
          })}
        </SubBlock>
        <WideButton onClick={enableDefaultGenes}>
          Вернуть стандартные
        </WideButton>
        <WideButton onClick={disableAllGenes}>
          Выключить все
        </WideButton>
      </Accordion>
      <Accordion name='Перезапуск' defaultOpened>
        <SubBlock name="Размер мира">
          <InputNumber
            placeholder="Ширина"
            min={1}
            max={2048}
            value={props.newWorldProps.width}
            onChange={e => {
              props.setNewWorldProps({
                ...props.newWorldProps,
                ...{
                  width: limit(
                    parseInt(e.target.min),
                    parseInt(e.target.max),
                    parseInt(e.target.value)
                  )
                }
              })
            }}
          />
          <InputNumber
            placeholder="Высота"
            min={1}
            max={2048}
            value={props.newWorldProps.height}
            onChange={e => props.setNewWorldProps({
              ...props.newWorldProps,
              ...{
                height: limit(
                  parseInt(e.target.min),
                  parseInt(e.target.max),
                  parseInt(e.target.value)
                )
              }
            })}
          />
        </SubBlock>
        <SubBlock name="Кол-во ботов">
          <InputNumber
            placeholder="Кол-во ботов"
            min={1}
            max={props.world.width * props.world.height}
            value={props.newWorldProps.botsAmount}
            onChange={e => props.setNewWorldProps({
              ...props.newWorldProps,
              ...{
                botsAmount: limit(
                  parseInt(e.target.min),
                  parseInt(e.target.max),
                  parseInt(e.target.value))
              }
            })}
          />
        </SubBlock>
        <SubBlock name="Размер генома">
          <InputNumber
            placeholder="Размер генома"
            // min={8}
            // max={256}
            value={props.newWorldProps.genomeSize}
            onChange={e => props.setNewWorldProps({
              ...props.newWorldProps,
              ...{
                genomeSize: parseInt(e.target.value)
              }
            })}
          />
        </SubBlock>
        <SubBlock>
          <WideButton onClick={props.onClickRestart}>
            Рестарт
          </WideButton>
        </SubBlock>
      </Accordion>
    </Wrapper>
  );
});

export default Sidebar;