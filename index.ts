import Bot, { Genome } from "./lib/Bot";
import { Rgba } from "./lib/drawing";
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
        new Bot(
            world,
            ...world.randEmpty(),
            Rgba.randRgb(),
            100,
            new Genome(64).fillPlant()
        );
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
        return new Rgba(0, 0, 50, 255)
            .interpolate(
                new Rgba(255, 255, 0, 255),
                block.energy / 50
            );
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
    setInterval(() => {
        let thisLoop = performance.now();
        fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;
        world.step();
        if (cycle % 2 === 0) {
            switch ($viewMode.value) {
                case 'normal': world.clearImage(); world.visualize(drawColors); break;
                case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
                default: break;
            }
        }
        $amount.innerHTML = Bot.amount.toString();
        $fps.innerHTML = fps.toFixed(1);
        cycle++;
    }, 1000 / 60);
});