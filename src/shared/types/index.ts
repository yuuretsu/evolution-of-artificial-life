import { Rgba } from 'shared/lib/color';

import type { SquareWorld } from 'shared/lib/world/world';
import type { CanGetColor } from './can-get-color';
import type { CanInteract } from './can-interact';
import type { ComponentType } from 'react';
import type { VisualiserParams } from 'shared/lib/view-modes';

export abstract class BaseWorldBlock implements CanGetColor, CanInteract {
  getJustColor(): Rgba | null {
    return new Rgba(255, 0, 0);
  }

  getInformativeColor(): Rgba | null {
    return this.getJustColor();
  }

  getFamilyColor(): Rgba | null {
    return this.getJustColor();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getEnergyColor(_params: VisualiserParams): Rgba | null {
    return this.getJustColor();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAgeColor(_params: VisualiserParams): Rgba | null {
    return this.getJustColor();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLastActionColor(_params: VisualiserParams): Rgba | null {
    return this.getJustColor();
  }

  getChildrenAmountColor(): Rgba | null {
    return this.getJustColor();
  }

  getAbilityColor(): Rgba | null {
    return this.getJustColor();
  }

  getHealthColor(): Rgba | null {
    return this.getJustColor();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAttack(_value: number): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onVirus(_genome: any, _color: Rgba) {}

  abstract Render: ComponentType;
}

export abstract class WorldBlockStatic extends BaseWorldBlock {
  isDynamic: false = false;
}

export abstract class WorldBlockDynamic extends BaseWorldBlock {
  age = 0;
  isDynamic: true = true;
  abstract live(x: number, y: number, world: SquareWorld): void;
}

export type WorldBlock = WorldBlockStatic | WorldBlockDynamic;
