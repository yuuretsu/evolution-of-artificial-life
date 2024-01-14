import { FlexColumn, InputNumber, SubBlock, WideButton } from 'shared/ui';
import { useUnit } from 'effector-react';

import {
  formNewWorldBotsAmount,
  formNewWorldGenomeSize,
  formNewWorldHeight,
  formNewWorldWidth,
  startNewWorldWithCurrentParameters,
} from './model';

import type { FC } from 'react';


export const StartNewWorld: FC = () => {
  const u = useUnit({
    startNewWorldWithCurrentParameters,
  });
  return (
    <FlexColumn gap={10}>
      <SubBlock name="Размер мира">
        <FlexColumn gap={5}>
          <InputNumber
            placeholder="Ширина"
            min={1}
            max={2048}
            {...formNewWorldWidth.use()}
          />
          <InputNumber
            placeholder="Высота"
            min={1}
            max={2048}
            {...formNewWorldHeight.use()}
          />
        </FlexColumn>
      </SubBlock>
      <SubBlock name="Кол-во ботов">
        <InputNumber
          placeholder="Кол-во ботов"
          min={1}
          {...formNewWorldBotsAmount.use()}
        />
      </SubBlock>
      <SubBlock name="Размер генома">
        <InputNumber
          placeholder="Размер генома"
          // min={8}
          // max={256}
          {...formNewWorldGenomeSize.use()}
        />
      </SubBlock>
      <WideButton onClick={u.startNewWorldWithCurrentParameters}>
        Рестарт
      </WideButton>
    </FlexColumn>
  );
};
