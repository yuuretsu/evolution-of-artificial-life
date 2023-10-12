import { GENES, getInitiallyEnabledGenesNames } from 'lib/genome';
import { observer } from 'mobx-react';
import { MdReplayCircleFilled, MdCancel } from 'react-icons/md';
import { Accordion, Checkbox, FlexColumn, FlexRow, SubBlock, WideButton } from 'ui';
import { IconContext } from 'react-icons';

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
    <Accordion name='Настройки мира' isOpen>
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
          <IconContext.Provider value={{ size: '20', style: { flex: '0 0 auto' } }}>
            <FlexRow gap={5}>
              <WideButton onClick={enableDefaultGenes}>
                <FlexRow gap={5} alignItems='center' justifyContent='center'>
                  <MdReplayCircleFilled />
                  Стандартные
                </FlexRow>
              </WideButton>
              <WideButton onClick={disableAllGenes}>
                <FlexRow gap={5} alignItems='center' justifyContent='center'>
                  <MdCancel color='rgb(200, 100, 100)' />
                  Откл. все
                </FlexRow>
              </WideButton>
            </FlexRow>
          </IconContext.Provider>
        </FlexColumn>
      </SubBlock>
    </Accordion>
  );
});