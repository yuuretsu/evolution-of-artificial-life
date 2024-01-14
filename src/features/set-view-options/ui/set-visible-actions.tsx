import { useUnit } from 'effector-react';
import { VISIBLE_GENES } from 'shared/lib/view-modes';
import { Checkbox, FlexColumn, FlexRow, SubBlock, WideButton } from 'shared/ui';
import { Rgba } from 'shared/lib/color';
import { IconContext } from 'react-icons';
import { MdCancel, MdChecklist } from 'react-icons/md';

import { $enabledLastActions, setEnabledLastActions } from '../model';

export const SetVisibleActions = () => {
  const u = useUnit({
    enabledLastActions: $enabledLastActions,
    setEnabledLastActions
  });

  const enableAllActions = () => {
    u.setEnabledLastActions(VISIBLE_GENES.map(({ id }) => id));
  };

  const disableAllActions = () => {
    u.setEnabledLastActions([]);
  };

  return (
    <FlexColumn gap={10}>
      <SubBlock name="Отображение отдельных действий">
        <FlexColumn gap={5}>
          {VISIBLE_GENES.map((gene) => {
            return (
              <Checkbox
                key={gene.id}
                title={gene.name}
                isChecked={u.enabledLastActions.includes(gene.id)}
                color={gene.color?.lerp(new Rgba(80, 80, 80), 0.75).toString()}
                onChange={(isChecked) => {
                  if (isChecked) {
                    u.setEnabledLastActions([...u.enabledLastActions, gene.id]);
                  } else {
                    u.setEnabledLastActions(u.enabledLastActions.filter((action) => action !== gene.id));
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
  );
};
