import type { Rgba } from 'lib/color';
import type { Genome } from 'lib/genome';

export interface CanInteract {
  onAttack(value: number): number;
  onVirus(genome: Genome, color: Rgba): void;
}
