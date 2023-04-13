import Rgba from 'lib/color';
import { Genome } from 'lib/genome';

export interface CanInteract {
  onAttack(value: number): number;
  onVirus(genome: Genome, color: Rgba): void;
}
