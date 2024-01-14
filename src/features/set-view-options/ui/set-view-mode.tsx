import { useUnit } from 'effector-react';
import { viewModesList } from 'shared/lib/view-modes';
import { Radio, SubBlock } from 'shared/ui';

import { $viewMode, setViewMode } from '../model';

export const SetViewMode = () => {
  const u = useUnit({
    viewModeName: $viewMode,
    setViewMode
  });

  return (
    <SubBlock name="Режим отображения">
      <Radio
        name='view-mode'
        list={viewModesList}
        checked={u.viewModeName}
        onChange={u.setViewMode}
      />
    </SubBlock>
  );
};
