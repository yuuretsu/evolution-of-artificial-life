import { useUnit } from 'effector-react';
import { FlexRow, WideButton } from 'shared/ui';
import { MdCancel } from 'react-icons/md';

import { disableAllGenes } from '../model';

export const DisableAllGenes = () => {
  const u = useUnit({
    disableAllGenes
  });

  return (
    <WideButton onClick={u.disableAllGenes}>
      <FlexRow gap={5} alignItems="center" justifyContent="center">
        <MdCancel color="rgb(200, 100, 100)" />
        Откл. все
      </FlexRow>
    </WideButton>
  );
};
