import { useUnit } from 'effector-react';
import { startNewWorldWithCurrentParameters } from 'features/start-new-world';
import { MdReplay } from 'react-icons/md';
import { RoundedButton } from 'shared/ui';

export const Restart = () => {
  const u = useUnit({
    startNewWorldWithCurrentParameters,
  });

  return (
    <RoundedButton title="Рестарт" onClick={u.startNewWorldWithCurrentParameters}>
      <MdReplay />
    </RoundedButton>
  );
};
