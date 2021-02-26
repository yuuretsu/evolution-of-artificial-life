import Bot, { Genome } from "./lib/Bot";
import { Rgba } from "./lib/drawing";
import { limNumber } from "./lib/math-functions";
import {
    drawColors,
    drawEnergy,
    drawFamilies,
    drawAbilities,
    drawLastAction,
    getNarrowImg
} from "./lib/view-modes";
import { Block, World } from "./lib/world";

function onResizeWindow() {
    (document.querySelector('.wrapper') as HTMLElement).style.maxHeight = `${window.innerHeight}px`;
}

function start() {

    (document.querySelector('#img') as HTMLElement).style.transform = `none`;

    Bot.amount = 0;

    world = new World(
        parseInt((document.querySelector('#input-width') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-height') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-pixel') as HTMLInputElement).value),
        document.querySelector('#img') as HTMLCanvasElement
    );

    // for (let x = 0; x < world.width; x++) {
    //     new Block(
    //         world,
    //         x,
    //         0,
    //         new Rgba(127, 127, 127, 255)
    //     );
    // }

    // for (let y = 1; y < world.height; y++) {
    //     new Block(
    //         world,
    //         0,
    //         y,
    //         new Rgba(127, 127, 127, 255)
    //     );
    // }

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
    }

    world.init();
}


// TODO типизировать options
function updateImage(world: World, mode: string, options: any, drawBotsNarrow: boolean) {
    switch (mode) {
        case 'normal': world.clearImage(); world.visualize(drawColors); break;
        case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
        case 'families': world.clearImage(); world.visualize(drawFamilies); break;
        case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
        case 'last-action': world.clearImage(); world.visualize(drawLastAction(options)); break;
        default: break;
    }
    if (drawBotsNarrow) {
        world.drawLayer(getNarrowImg(world));
    }
}

let world: World;

window.addEventListener('resize', onResizeWindow);

window.addEventListener('load', () => {

    onResizeWindow();

    const $inputFps = document.querySelector('#input-fps') as HTMLInputElement;

    document.querySelectorAll(
        '#input-width, #input-height, #input-pixel, #input-fps'
    ).forEach(elem => {
        elem.addEventListener('change', event => {
            const target = event.target as HTMLInputElement;
            target.value = limNumber(
                parseInt(target.min),
                parseInt(target.max),
                parseInt(target.value)
            ).toString();
        })
    });

    const $imgContainer = document.querySelector('#img-container') as HTMLElement;
    const $img = document.querySelector('#img') as HTMLElement;

    document.querySelector('#btn-menu')?.addEventListener('change', event => {
        if ((event.target as HTMLInputElement).checked) {
            $imgContainer.classList.add('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.add('wrapper__menu--menu-opened');
        } else {
            $imgContainer.classList.remove('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.remove('wrapper__menu--menu-opened');
        }
    });

    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let xOffset = 0;
    let yOffset = 0;
    let active = false;

    function dragStart(e: TouchEvent | MouseEvent) {
        if (e instanceof TouchEvent) {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === $img) {
            active = true;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }

    function drag(e: TouchEvent | MouseEvent) {
        if (active) {
            e.preventDefault();
            if (e instanceof TouchEvent) {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            $img.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    $imgContainer.addEventListener("touchstart", dragStart, false);
    $imgContainer.addEventListener("touchend", dragEnd, false);
    $imgContainer.addEventListener("touchmove", drag, false);

    $imgContainer.addEventListener("mousedown", dragStart, false);
    $imgContainer.addEventListener("mouseup", dragEnd, false);
    $imgContainer.addEventListener("mousemove", drag, false);

    type viewActionsMode
        = 'view-photosynthesis'
        | 'view-attack'
        | 'view-multiply'
        | 'view-share-energy'
        | 'view-move'

    const viewActionsOptions = {
        'view-photosynthesis': true,
        'view-attack': true,
        'view-multiply': true,
        'view-share-energy': true,
        'view-move': true
    }

    const viewActionsOptionsList: string[] = [];
    for (const actionName in viewActionsOptions) {
        viewActionsOptionsList.push(`#${actionName}`);
    }

    document.querySelectorAll(viewActionsOptionsList.join(','))
        .forEach(checkbox => {
            const chbx = checkbox as HTMLInputElement;
            chbx.addEventListener('change', () => {
                viewActionsOptions[chbx.id as viewActionsMode] = chbx.checked;
                updateImage(world, $viewMode.value, viewActionsOptions, $narrows.checked);
            });
        });

    const $amount = document.querySelector('#amount') as HTMLElement;
    const $fps = document.querySelector('#fps') as HTMLElement;
    const $frameNumber = document.querySelector('#frame-number') as HTMLElement;
    const $viewMode = document.querySelector('#view-mode') as HTMLSelectElement;
    $viewMode.addEventListener('change', event => {
        const $viewActions = document.querySelector('#view-actions-options') as HTMLInputElement;
        if ($viewMode.value === 'last-action') {
            $viewActions.classList.remove('hidden');
        } else {
            $viewActions.classList.add('hidden');
        }
        updateImage(world, $viewMode.value, viewActionsOptions, $narrows.checked);
    });
    const $narrows = document.querySelector('#chbx-narrows') as HTMLInputElement;
    const $chbxUpdImg = document.querySelector('#chbx-upd-img') as HTMLInputElement;
    document.querySelector('#btn-start')?.addEventListener('click', start);
    document.querySelector('#btn-step')?.addEventListener('click', () => {
        pauseSimulation();
        world.step();
        updateImage(world, $viewMode.value, viewActionsOptions, $narrows.checked);
    });
    const $btnPause = document.querySelector('#btn-pause') as HTMLButtonElement;
    $btnPause.addEventListener('click', (e) => {
        switch (paused) {
            case true:
                continueSimulation();
                break;
            case false:
                pauseSimulation();
                break;
        }
    });
    start();

    function continueSimulation() {
        paused = false;
        $chbxUpdImg.checked = true;
    }

    function pauseSimulation() {
        paused = true;
        $chbxUpdImg.checked = false;
    }

    let lastLoop = Date.now();
    let fps = 0;
    let paused = false;
    // setInterval(() => {
    //     if (Date.now() - lastLoop > 1000) {
    //         $fps.innerHTML = fps.toFixed(0);
    //         fps = 0;
    //         lastLoop = Date.now();
    //     }
    //     fps++;
    //     if (!paused) world.step();
    //     if ($chbxUpdImg.checked) {
    //         updateImage(world, $viewMode.value, $narrows.checked);
    //     }
    //     $amount.innerHTML = Bot.amount.toString();
    //     $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)} тыс. кадров`;
    // });

    (function step() {
        if (Date.now() - lastLoop > 1000) {
            $fps.innerHTML = fps.toFixed(0);
            fps = 0;
            lastLoop = Date.now();
        }
        fps++;
        if (!paused) world.step();
        if ($chbxUpdImg.checked) {
            updateImage(world, $viewMode.value, viewActionsOptions, $narrows.checked);
        }
        $amount.innerHTML = Bot.amount.toString();
        $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)} тыс. кадров`;
        setTimeout(step, 1000 / parseInt($inputFps.value));
    })();
});