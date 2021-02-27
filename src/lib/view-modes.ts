import Bot from "./Bot";
import { PixelsData, Rgba } from "./drawing";
import { normalizeNumber } from "./math-functions";
import { Block, MOORE_NEIGHBOURHOOD, World } from "./world";

export function drawColors(block: any) {
    if (block instanceof Block) {
        return block.color;
    }
    return null;
}

// export function drawEnergy(block: any) {
//     if (block instanceof Bot) {
//         return new Rgba(20, 20, 100, 255)
//             .interpolate(
//                 new Rgba(255, 255, 0, 255),
//                 block.energy / 100
//             );
//     }
//     return null;
// }

export function drawEnergy(divider: number): (block: any) => Rgba | null {
    return block => {
        return block instanceof Bot
            ? new Rgba(0, 0, 50, 255)
                .interpolate(
                    new Rgba(255, 255, 0, 255),
                    block.energy / divider
                )
            : null;
    }
}

export function drawAbilities(block: any) {
    if (block instanceof Bot) {
        return new Rgba(
            normalizeNumber(0.5, 1, block.abilities.attack) * 255,
            normalizeNumber(0.5, 1, block.abilities.photo) * 255,
            50,
            255
        );
    }
    return null;
}

export function drawFamilies(block: any) {
    if (block instanceof Bot) {
        return block.family;
    }
    return null;
}

export function drawAges(block: any) {
    return block instanceof Bot
        ? new Rgba(150, 150, 150, 255)
            .interpolate(new Rgba(0, 0, 100, 255), block.age / 2000)
        : null;
}

export function drawLastAction(options: any): (block: any) => Rgba | null {
    return block => {
        return block instanceof Bot
            ? options[block.lastAction.name]
                ? block.lastAction.color
                : new Rgba(20, 20, 20, 255)
            : null
    }
}

export function getNarrowImg(world: World): HTMLCanvasElement {
    const img = new PixelsData(world.width * 3, world.height * 3);
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            const block = world.get(x, y);
            if (block instanceof Bot) {
                const xy: [number, number] = [
                    block.x * 3 + 1 + MOORE_NEIGHBOURHOOD[block.narrow][0],
                    block.y * 3 + 1 + MOORE_NEIGHBOURHOOD[block.narrow][1],
                ];
                img.setPixel(...xy, new Rgba(0, 0, 0, 127));
            }
        }
    }
    img.update();
    return img.node;
}