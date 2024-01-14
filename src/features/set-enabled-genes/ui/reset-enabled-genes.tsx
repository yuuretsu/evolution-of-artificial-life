import { useUnit } from 'effector-react';
import { FlexRow, WideButton } from 'shared/ui';
import { MdReplayCircleFilled } from 'react-icons/md';

import { resetEnabledGenes } from '../model';

export const ResetEnabledGenes = () => {
  const u = useUnit({
    resetEnabledGenes
  });

  return (
    <WideButton onClick={u.resetEnabledGenes}>
      <FlexRow gap={5} alignItems="center" justifyContent="center">
        <MdReplayCircleFilled />
        Стандартные
      </FlexRow>
    </WideButton>
  );
};
