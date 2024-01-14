import { useUnit } from 'effector-react';
import { $enabledGenes } from 'entities/enabled-genes';
import { Rgba } from 'shared/lib/color';
import { GENES, GENES_NAMES } from 'shared/lib/genome/genes';
import { Checkbox, FlexColumn, FlexRow, SubBlock } from 'shared/ui';
import { IconContext } from 'react-icons';

import { disableAllGenes, resetEnabledGenes, addGene, removeGene } from '../model';

import { ResetEnabledGenes } from './reset-enabled-genes';
import { DisableAllGenes } from './disable-all-genes';

export const SetEnabledGenes = () => {
  const u = useUnit({
    enabledGenes: $enabledGenes,
    resetEnabledGenes,
    disableAllGenes,
    addGene,
    removeGene
  });

  return (
    <SubBlock name="Генофонд">
      <FlexColumn gap={10}>
        <FlexColumn gap={5}>
          {GENES_NAMES.map((key) => {
            const color = GENES[key]!.color?.lerp(new Rgba(80, 80, 80), 0.75).toString();
            return (
              <Checkbox
                key={key}
                color={color}
                title={GENES[key]!.name}
                isChecked={u.enabledGenes.includes(key)}
                onChange={(checked) => {
                  const toggle = checked ? addGene : removeGene;
                  toggle(key);
                }}
              />
            );
          })}
        </FlexColumn>
        <IconContext.Provider
          value={{ size: '20', style: { flex: '0 0 auto' } }}
        >
          <FlexRow gap={5}>
            <ResetEnabledGenes />
            <DisableAllGenes />
          </FlexRow>
        </IconContext.Provider>
      </FlexColumn>
    </SubBlock>
  );
};
