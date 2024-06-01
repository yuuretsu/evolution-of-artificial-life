import { useUnit } from 'effector-react';
import { $isPaused } from 'entities/play-pause';
import { toggleIsPlaying } from 'features/play-pause';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { RoundedToggle } from 'shared/ui';

export const TogglePlayPause = () => {
  const u = useUnit({
    isPaused: $isPaused,
    toggleIsPlaying
  });
  return (
    <RoundedToggle
      title={u.isPaused ? 'Возобновить' : 'Пауза'}
      slotA={<MdPlayArrow />}
      slotB={<MdPause />}
      isA={u.isPaused}
      onChange={u.toggleIsPlaying}
    />
  );
};
