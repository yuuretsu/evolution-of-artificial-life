import Bot, { Genome } from "./lib/Bot";
import { Rgba } from "./lib/drawing";
import { normalizeNumber } from "./lib/math-functions";
import { Block, World } from "./lib/world";

function start() {

    Bot.amount = 0;

    world = new World(
        parseInt((document.querySelector('#input-width') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-height') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-pixel') as HTMLInputElement).value),
        document.querySelector('#img') as HTMLCanvasElement
    );

    const BOTS_AMOUNT = parseInt((document.querySelector('#input-bots') as HTMLInputElement).value);

    for (let i = 0; i < Math.min(world.width * world.height, BOTS_AMOUNT); i++) {
        const a = new Bot(
            world,
            ...world.randEmpty(),
            new Rgba(100, 100, 100, 255),
            100,
            new Genome(64).fillRandom(),
            Rgba.randRgb(),
            { photo: 0.5, attack: 0.5 }
        );
        a.narrow = 0;
    }

    world.init();
}

function drawColors(block: any) {
    if (block instanceof Block) {
        return block.color;
    }
    return null;
}

function drawEnergy(block: any) {
    if (block instanceof Bot) {
        return new Rgba(0, 0, 255, 255)
            .interpolate(
                new Rgba(255, 255, 0, 255),
                block.energy / 100
            );
    }
    return null;
}

function drawAbilities(block: any) {
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

function drawFamilies(bot: any) {
    if (bot instanceof Bot) {
        return bot.family;
    }
    return null;
}

let world: World;

window.addEventListener('load', () => {
    const $amount = document.querySelector('#amount') as HTMLElement;
    const $fps = document.querySelector('#fps') as HTMLElement;
    const $viewMode = document.querySelector('#view-mode') as HTMLSelectElement;
    document.querySelector('#btn-start')?.addEventListener('click', start);
    start();

    let cycle = 0;
    let lastLoop = performance.now();
    let fps = 0;
    let fpsList = new Array(5).fill(0);
    setInterval(() => {
        let thisLoop = performance.now();
        fps = 1000 / (thisLoop - lastLoop);
        fpsList.pop();
        fpsList.unshift(fps);
        lastLoop = thisLoop;
        world.step();
        if (cycle % 1 === 0) {
            switch ($viewMode.value) {
                case 'normal': world.clearImage(); world.visualize(drawColors); break;
                case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
                case 'families': world.clearImage(); world.visualize(drawFamilies); break;
                case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
                default: break;
            }
        }
        // world.clearImage(); world.visualize(drawLight);
        $amount.innerHTML = Bot.amount.toString();
        $fps.innerHTML = (fpsList.reduce((a, b) => a + b) / fpsList.length).toFixed(1);
        cycle++;
    });

    // (function loop() {
    //     let thisLoop = performance.now();
    //     fps = 1000 / (thisLoop - lastLoop);
    //     fpsList.pop();
    //     fpsList.unshift(fps);
    //     lastLoop = thisLoop;
    //     world.step();
    //     if (cycle % 1 === 0) {
    //         switch ($viewMode.value) {
    //             case 'normal': world.clearImage(); world.visualize(drawColors); break;
    //             case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
    //             case 'families': world.clearImage(); world.visualize(drawFamilies); break;
    //             case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
    //             default: break;
    //         }
    //     }
    //     // world.clearImage(); world.visualize(drawLight);
    //     $amount.innerHTML = Bot.amount.toString();
    //     $fps.innerHTML = (fpsList.reduce((a, b) => a + b) / fpsList.length).toFixed(1);
    //     cycle++;
    //     requestAnimationFrame(loop);
    // })();
});