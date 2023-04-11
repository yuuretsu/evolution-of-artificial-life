import { Block } from "ui";
import { Bot } from "./bot";
import Rgba from "./color";
import { GenePool } from "./genome";
import { VisualiserParams } from "./view-modes";
import { World } from "./world";

export class WorldBlock {
    public age: number | null = null;
    constructor(public color: Rgba) {
    }
    getNormalColor(): Rgba | null {
        return null;
    }
    getFamilyColor(): Rgba | null {
        return null;
    }
    getEnergyColor(_params: VisualiserParams): Rgba | null {
        return null;
    }
    getAgeColor(_params: VisualiserParams): Rgba | null {
        return null;
    }
    getLastActionColor(_params: VisualiserParams): Rgba | null {
        return null;
    }
    getChildrenAmountColor(_params: VisualiserParams): Rgba | null {
        return null;
    }
    getAbilityColor(): Rgba | null {
        return null;
    }
    getHealthColor(): Rgba | null {
        return null;
    }
    onAttack(_bot: Bot, _value: number): number { return 0; }
    onVirus(_bot: Bot, _pool: GenePool) { }

    Render = () => <Block name={'Блок'}>Нет информации. Попробуйте выбрать другой блок.</Block>;
}

export abstract class DynamicBlock extends WorldBlock {
    abstract live(x: number, y: number, world: World): void;
}