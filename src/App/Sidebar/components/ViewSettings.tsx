import { viewModesList } from 'lib/view-modes';
import { observer } from 'mobx-react';
import { appStore } from 'stores/app';
import { Accordion, Checkbox, FlexColumn, InputRange, OptionalBlock, Radio, SubBlock, WideButton } from 'ui';

import type { VisualiserParams} from 'lib/view-modes';
import type { FC } from 'react';

export interface IViewSettingsProps {
  visualizerParams: VisualiserParams;
  setVisualizerParams: (value: VisualiserParams) => void;
}

export const ViewSettings: FC<IViewSettingsProps> = observer((props) => {

  const enableAllActions = () => {
    const action = Object
      .entries(props.visualizerParams.action)
      .reduce((acc, [name]) => ({ ...acc, [name]: true }), {});
    props.setVisualizerParams({ ...props.visualizerParams, action });
  };

  const disableAllActions = () => {
    const action = Object
      .entries(props.visualizerParams.action)
      .reduce((acc, [name]) => ({ ...acc, [name]: false }), {});
    props.setVisualizerParams({ ...props.visualizerParams, action });
  };

  return (
    <Accordion name='Настройки просмотра' defaultOpened>
      <FlexColumn gap={10}>
        <SubBlock name={'Время между обновлениями'}>
          <InputRange
            min={1}
            max={200}
            value={appStore.timeBetweenSteps.current}
            onChange={e => appStore.timeBetweenSteps.set(+e.target.value)}
          />
        </SubBlock>
        <SubBlock name="Режим отображения">
          <Radio
            name='view-mode'
            list={viewModesList}
            checked={appStore.viewModeName.current}
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
        {appStore.viewModeName.current === 'lastAction' && (
          <OptionalBlock>
            <FlexColumn gap={10}>
              <SubBlock name="Отображение отдельных действий">
                <FlexColumn gap={5}>
                  {Object
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
                    })}
                </FlexColumn>
              </SubBlock>
              <FlexColumn gap={5}>
                <WideButton onClick={enableAllActions}>
                  Включить все
                </WideButton>
                <WideButton onClick={disableAllActions}>
                  Выключить все
                </WideButton>
              </FlexColumn>
            </FlexColumn>
          </OptionalBlock>
        )}
      </FlexColumn>
    </Accordion>
  );
});