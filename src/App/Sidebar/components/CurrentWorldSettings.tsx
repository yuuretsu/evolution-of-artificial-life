import { GENES, getInitiallyEnabledGenesNames } from 'lib/genome';
import { observer } from 'mobx-react';
import { Accordion, Checkbox, FlexColumn, FlexRow, SubBlock, WideButton } from 'ui';

import type { FC } from 'react';

export interface ICurrentWorldSettingsProps {
  enabledGenes: Record<string, boolean>;
  onChangeEnabledGenes: (value: Record<string, boolean>) => void;
}

export const CurrentWorldSettings: FC<ICurrentWorldSettingsProps> = observer((props) => {
  const enableDefaultGenes = () => {
    props.onChangeEnabledGenes(getInitiallyEnabledGenesNames());
  };

  const disableAllGenes = () => {
    props.onChangeEnabledGenes(Object.fromEntries(Object.keys(GENES).map((name) => [name, false])));
  };

  return (
    <Accordion name='Настройки мира' isDefaultOpened>
      <SubBlock name="Генофонд">
        <FlexColumn gap={10}>
          <FlexColumn gap={5}>
            {Object.keys(props.enabledGenes).map(key => {
              return (
                <Checkbox
                  title={GENES[key]!.name}
                  value={key}
                  key={key}
                  isChecked={props.enabledGenes[key]}
                  onChange={(value, checked) => {
                    const newEnabledGenes = { ...props.enabledGenes };
                    newEnabledGenes[value] = checked;
                    props.onChangeEnabledGenes(newEnabledGenes);
                  }}
                />
              );
            })}
          </FlexColumn>
          <FlexRow gap={5}>
            <WideButton onClick={enableDefaultGenes}>
              Стандартные
            </WideButton>
            <WideButton onClick={disableAllGenes}>
              Все
            </WideButton>
          </FlexRow>
        </FlexColumn>
      </SubBlock>
    </Accordion>
  );
});