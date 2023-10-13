import { limit } from 'lib/helpers';
import { observer } from 'mobx-react';
import { Accordion, FlexColumn, InputNumber, SubBlock, WideButton } from 'ui';
import { accordionsStates } from 'stores/accordions';

import type { NewWorldProps } from 'lib/world';
import type { FC } from 'react';

export interface INewWorldProps {
  newWorldProps: NewWorldProps;
  maxBotsAmount: number;
  setNewWorldProps: (value: NewWorldProps) => void;
  onClickRestart: () => void;
}

export const NewWorldForm: FC<INewWorldProps> = observer((props) => {
  return (
    <Accordion name='Перезапуск' {...accordionsStates.getProps('restartWorld')}>
      <FlexColumn gap={10}>
        <SubBlock name="Размер мира">
          <FlexColumn gap={5}>
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
                });
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
          </FlexColumn>
        </SubBlock>
        <SubBlock name="Кол-во ботов">
          <InputNumber
            placeholder="Кол-во ботов"
            min={1}
            max={props.maxBotsAmount}
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
        <WideButton onClick={props.onClickRestart}>
          Рестарт
        </WideButton>
      </FlexColumn>
    </Accordion>
  );
});
