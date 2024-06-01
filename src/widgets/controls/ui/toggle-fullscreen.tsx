import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { RoundedToggle } from 'shared/ui';

type ToggleFullscreenProps = {
  fullscreenElement: HTMLElement | null;
}

export const ToggleFullscreen = ({ fullscreenElement }: ToggleFullscreenProps) => {
  const isInFullscreen = document.fullscreenElement === fullscreenElement;

  const onClickFullscreen = () => isInFullscreen
    ? document.exitFullscreen()
    : fullscreenElement?.requestFullscreen?.();

  return (
    <RoundedToggle
      title={isInFullscreen ? 'Выход из полноэкранного режима' : 'Полноэкранный режим'}
      slotA={<MdFullscreen />}
      slotB={<MdFullscreenExit />}
      isA={!isInFullscreen}
      onChange={onClickFullscreen}
    />
  );
};
