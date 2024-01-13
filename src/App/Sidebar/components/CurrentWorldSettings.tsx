import { GENES } from 'lib/genome';
import { observer } from 'mobx-react';
import { MdReplayCircleFilled, MdCancel } from 'react-icons/md';
import { Accordion, Checkbox, FlexColumn, FlexRow, SubBlock, WideButton } from 'ui';
import { IconContext } from 'react-icons';
import { accordionsStates } from 'stores/accordions';
import { Rgba } from 'lib/color';
import { GENES_NAMES, INITIALLY_ENABLED_GENES_NAMES, type GeneName } from 'lib/genome/genes';

import type { FC } from 'react';

export interface ICurrentWorldSettingsProps {
  enabledGenes: GeneName[];
  onChangeEnabledGenes: (value: GeneName[]) => void;
}

export const CurrentWorldSettings: FC<ICurrentWorldSettingsProps> = observer((props) => {
  const enableDefaultGenes = () => {
    props.onChangeEnabledGenes(INITIALLY_ENABLED_GENES_NAMES);
  };

  const disableAllGenes = () => {
    props.onChangeEnabledGenes([]);
  };

  return (
    <Accordion name='Настройки мира' {...accordionsStates.getProps('worldSettings')}>
      <SubBlock name="Генофонд">
        <FlexColumn gap={10}>
          <FlexColumn gap={5}>
            {(GENES_NAMES).map((key) => {
              return (
                <Checkbox
                  key={key}
                  color={GENES[key]!.color?.lerp(new Rgba(80, 80, 80), 0.75).toString()}
                  title={GENES[key]!.name}
                  isChecked={props.enabledGenes.includes(key)}
                  onChange={(checked) => {
                    const newEnabledGenes = new Set([...props.enabledGenes]);
                    if (checked) {
                      newEnabledGenes.add(key);
                    } else {
                      newEnabledGenes.delete(key);
                    }
                    props.onChangeEnabledGenes(Array.from(newEnabledGenes));
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