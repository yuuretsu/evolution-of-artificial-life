import { MdSkipNext } from 'react-icons/md';
import { RoundedButton } from 'shared/ui';

type MakeSimulationStepProps = {
  onClickStep: () => void;
}

export const MakeSimulationStep = ({ onClickStep }: MakeSimulationStepProps) => {
  return (
    <RoundedButton title="Шаг симуляции" onClick={onClickStep}>
      <MdSkipNext />
    </RoundedButton>
  );
};
