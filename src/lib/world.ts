import { Canvas, PixelsData, Rgba } from "./drawing";
import Grid from "./Grid";
import { fixNumber, randInt, range } from "./math-functions";

export const MOORE_NEIGHBOURHOOD: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
];

export class Block {
    constructor(
        readonly world: World,
        public x: number,
        public y: number,
        public color: Rgba
    ) {
        world.set(x, y, this);
    }
}

export class DynamicBlock extends Block {
    alive: boolean;
    constructor(world: World, x: number, y: number, color: Rgba) {
        super(world, x, y, color);
        world.assign(this);
        this.alive = true;
    }
    onStep() {

    }
    onDie() {

    }
}

export class World extends Grid<Block | undefined> {
    private readonly img: Canvas;
    private dynamic: { a: any; b: any; };
    constructor(
        readonly width: number,
        readonly height: number,
        pixelSize: number,
        node: HTMLCanvasElement
    ) {
        super(width, height);
        this.img = new Canvas(width * pixelSize, height * pixelSize, node);
        this.img.ctx.imageSmoothingEnabled = false;
        this.dynamic = { a: {}, b: {} };
    }
    set(x: number, y: number, block: Block | undefined) {
        super.set(x, y, block);
        if (block) {
            block.x = x;
            block.y = y;
        }
    }
    drawLayer(layer: CanvasImageSource) {
        this.img.ctx.drawImage(
            layer,
            0,
            0,
            this.img.node.width,
            this.img.node.height
        );
    }
    clearImage() {
        this.img.ctx.clearRect(
            0,
            0,
            this.img.node.width,
            this.img.node.height
        );
    }
    visualize(func: (block: any | undefined, x: number, y: number) => Rgba | null) {
        let img = new PixelsData(this.width, this.height);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const col = func(this.get(x, y), x, y);
                if (col) {
                    img.setPixel(x, y, col);
                }
            }
        }
        this.drawLayer(img.update().node);
    }
    assign(block: DynamicBlock) {
        let i: number;
        do {
            i = randInt(0, this.width * this.height * 1000);
        } while (this.dynamic.a[i]);
        this.dynamic.a[i] = block;
    }
    init() {
        this.dynamic.b = this.dynamic.a;
    }
    step() {
        this.dynamic.a = {};
        for (const key in this.dynamic.b) {
            const block: DynamicBlock = this.dynamic.b[key];
            if (!block.alive) {
                this.set(block.x, block.y, undefined);
                block.onDie();
            } else {
                block.onStep();
                this.assign(block);
            }
        }
        this.dynamic.b = this.dynamic.a;
    }
}
