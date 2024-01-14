import type { Rgba } from 'shared/lib/color';
import type { Genome } from 'shared/lib/genome';

export interface CanInteract {
  onAttack(value: number): number;
  onVirus(genome: Genome, color: Rgba): void;
}
