import { useUnit } from 'effector-react';
import { $viewMode, setViewMode } from 'entities/view-mode';
import { Rgba } from 'lib/color';
import { createToggleStore } from 'lib/helpers';
import { useAccordionToggle } from 'lib/hooks';
import { VISIBLE_GENES, viewModesList } from 'lib/view-modes';
import { IconContext } from 'react-icons';
import { MdCancel, MdChecklist } from 'react-icons/md';
import { Accordion, Checkbox, FlexColumn, FlexRow, InputRange, OptionalBlock, Radio, SubBlock, WideButton } from 'ui';

import type { VisualiserParams } from 'lib/view-modes';
import type { FC } from 'react';

export interface IViewSettingsProps {
  visualizerParams: VisualiserParams;
  setVisualizerParams: (value: VisualiserParams) => void;
}

export const ViewSettings: FC<IViewSettingsProps> = (props) => {

  const u = useUnit({
    viewModeName: $viewMode,
    setViewMode
  });

  const viewSettingsAccordionProps = useAccordionToggle(
    viewSettingsAccordionState.$isEnabled,
    viewSettingsAccordionState.toggle
  );

  const enableAllActions = () => {
    props.setVisualizerParams({ ...props.visualizerParams, action: VISIBLE_GENES.map(({ id }) => id) });
  };

  const disableAllActions = () => {
    props.setVisualizerParams({ ...props.visualizerParams, action: [] });
  };

  return (
    <Accordion name='Настройки просмотра' {...viewSettingsAccordionProps}>
      <FlexColumn gap={10}>
        <SubBlock name="Режим отображения">
          <Radio
            name='view-mode'
            list={viewModesList}
            checked={u.viewModeName}
            onChange={u.setViewMode}
          />
        </SubBlock>
        {u.viewModeName === 'age' && <OptionalBlock>
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
        {u.viewModeName === 'energy' && <OptionalBlock>
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
        {u.viewModeName === 'lastAction' && (
          <OptionalBlock>
            <FlexColumn gap={10}>
              <SubBlock name="Отображение отдельных действий">
                <FlexColumn gap={5}>
                  {VISIBLE_GENES.map((gene) => {
                    return (
                      <Checkbox
                        key={gene.id}
                        title={gene.name}
                        isChecked={props.visualizerParams.action.includes(gene.id)}
                        color={gene.color?.lerp(new Rgba(80, 80, 80), 0.75).toString()}
                        onChange={(checked) => {
                          if (checked) {
                            props.setVisualizerParams({
                              ...props.visualizerParams,
                              action: [...props.visualizerParams.action, gene.id]
                            });
                          } else {
                            props.setVisualizerParams({
                              ...props.visualizerParams,
                              action: props.visualizerParams.action.filter((action) => action !== gene.id)
                            });
                          }
                        }}
                      />
                    );
                  })}
                </FlexColumn>
              </SubBlock>
              <IconContext.Provider value={{ size: '20', style: { flex: '0 0 auto' } }}>
                <FlexRow gap={5} style={{ whiteSpace: 'nowrap' }}>
                  <WideButton onClick={enableAllActions}>
                    <FlexRow gap={5} alignItems='center' justifyContent='center'>
                      <MdChecklist color='rgb(100, 200, 100)' /> Все
                    </FlexRow>
                  </WideButton>
                  <WideButton onClick={disableAllActions}>
                    <FlexRow gap={5} alignItems='center' justifyContent='center'>
                      <MdCancel color='rgb(200, 100, 100)' /> Откл. все
                    </FlexRow>
                  </WideButton>
                </FlexRow>
              </IconContext.Provider>
            </FlexColumn>
          </OptionalBlock>
        )}
      </FlexColumn>
    </Accordion>
  );
};

const viewSettingsAccordionState = createToggleStore(true);
