import { World } from "./world";
import Rgba from "./color";
import { Bot } from "./bot";
import { VisualiserParams } from "./view-modes";
import SubBlock from "../components/App/Sidebar/SubBlock";
import React from "react";
import Block from "../components/App/Sidebar/Block";
import { GenePool } from "./genome";
import WideButton from "../components/App/Sidebar/WideButton";

export class WorldBlock {
    public age: number | null = null;
    constructor(public color: Rgba) {
    }
    getNormalColor(): Rgba | null {
        return null;
    }
    getEnergyColor(params: VisualiserParams): Rgba | null {
        return null;
    }
    getAgeColor(params: VisualiserParams): Rgba | null {
        return null;
    }
    getLastActionColor(params: VisualiserParams): Rgba | null {
        return null;
    }
    getChildrenAmountColor(params: VisualiserParams): Rgba | null {
        return null;
    }
    getAbilityColor(): Rgba | null {
        return null;
    }
    getHealthColor(): Rgba | null {
        return null;
    }
    onAttack(bot: Bot, value: number): number { return 0; }
    onVirus(bot: Bot, pool: GenePool) { }
    getInfo() {
        return (
            <Block name={'Блок'}>Нет информации. Попробуйте выбрать другой блок.</Block>
        );
    }
}

export abstract class DynamicBlock extends WorldBlock {
    abstract live(x: number, y: number, world: World): void;
}