import { Rgba } from "./drawing";
import { ActionFn, createGenePool, getAllGenesNames } from "./Gene-templates";
import { fixNumber, limNumber, randChoice, randFloat, randInt } from "./math-functions";
import { DynamicBlock, MOORE_NEIGHBOURHOOD, World } from "./world";

export default class Bot extends DynamicBlock {
    static amount = 0;
    private _narrow: number;
    age: number;
    lastAction: { name: string, color: Rgba };
    constructor(
        world: World,
        x: number,
        y: number,
        color: Rgba,
        public energy: number,
        public genome: Genome,
        public family: Rgba,
        public abilities: {
            photo: number,
            attack: number
        }
    ) {
        super(world, x, y, color);
        Bot.amount++;
        this._narrow = randInt(0, 8);
        this.age = 0;
        this.lastAction = { name: 'none', color: new Rgba(20, 20, 20, 255) };
    }
    set narrow(n: number) {
        this._narrow = fixNumber(0, 8, n);
    }
    get narrow(): number {
        return this._narrow;
    }
    narrowToCoords(): [number, number] {
        const x = this.x + MOORE_NEIGHBOURHOOD[this.narrow][0];
        const y = this.y + MOORE_NEIGHBOURHOOD[this.narrow][1];
        return this.world.fixCoords(x, y);
    }
    getForvard() {
        const coords = this.narrowToCoords();
        return { block: this.world.get(...coords), coords: coords };
    }
    moveTo(x: number, y: number) {
        this.world.swap(this.x, this.y, x, y);
    }
    multiplyTo(x: number, y: number) {
        new Bot(
            this.world,
            x,
            y,
            this.color.interpolate(new Rgba(255, 255, 255, 255), 0.25),
            this.energy / 3,
            this.genome.replication(),
            this.family.mutateRgb(10),
            { ...this.abilities }
        );
        this.energy /= 3;
    }
    randMove() {
        const coords = this.world.fixCoords(
            this.x + randInt(-1, 2),
            this.y + randInt(-1, 2)
        );
        this.moveTo(...coords);
    }
    onStep() {
        if (this.energy < 1 || this.energy > 100 || this.age > 2000) {
            this.alive = false;
            return;
        }
        this.genome.doAction(this);
        this.energy -= 0.1;
        this.age += 1;
    }
    onDie() {
        Bot.amount--;
        // new DeadBot(this);
    }
}

export class DeadBot extends DynamicBlock {
    age: number;
    constructor(bot: Bot) {
        super(bot.world, bot.x, bot.y, bot.color.interpolate(new Rgba(0, 0, 0, 255), 0.5));
        this.age = 0;
    }
    onStep() {
        if (this.age > 500) {
            this.alive = false;
        }
        this.color = this.color.interpolate(new Rgba(10, 10, 50, 255), 0.005);
        this.age++;
    }
}

export class Genome {
    static genePool = createGenePool(getAllGenesNames());
    genes: Gene[];
    private _pointer: number;
    constructor(readonly length: number) {
        this.genes = [];
        this._pointer = 0;
    }
    set pointer(n: number) {
        this._pointer = fixNumber(0, this.length, n);
    }
    get pointer() {
        return this._pointer;
    }
    randGene(): Gene {
        return {
            action: randChoice(Genome.genePool),
            property: Math.random(),
            branches: [
                randInt(0, this.length),
                randInt(0, this.length),
                randInt(0, this.length),
                randInt(0, this.length)
            ]
        };
    }
    mutateGene(gene: Gene): Gene {
        return {
            action: Math.random() > 0.9 ? randChoice(Genome.genePool) : gene.action,
            property: limNumber(0, 1, gene.property + randFloat(-0.01, 0.01)),
            branches: gene.branches.map(
                i => Math.random() > 0.9
                    ? randInt(0, this.length)
                    : i
            ) as [number, number, number, number]
        }
    }
    fillRandom(start: number = 0): this {
        for (let i = start; i < this.length; i++) {
            this.genes[i] = this.randGene();
        }
        return this;
    }
    // replication2() {
    //     const genome = new Genome(this.length);
    //     for (let i = 0; i < this.length; i++) {
    //         genome.genes[i] = this.mutateGene(this.genes[i]);
    //     }
    //     return genome;
    // }
    // replication() {
    //     const genome = new Genome(this.length);
    //     for (let i = 0; i < this.length; i++) {
    //         genome.genes[i] = this.genes[i];
    //     }
    //     const pointer = randInt(0, genome.length);
    //     genome.genes[pointer] = this.mutateGene(this.genes[pointer]);
    //     return genome;
    // }
    replication() {
        const genome = new Genome(this.length);
        for (let i = 0; i < this.length; i++) {
            genome.genes[i] = Math.random() > 0.995
                ? this.mutateGene(this.genes[i])
                : this.genes[i];
        }
        return genome;
    }
    doAction(bot: Bot) {
        // bot.lastAction = { name: 'none', color: new Rgba(20, 20, 20, 255) };
        for (let i = 0; i < 20; i++) {
            const GENE: Gene = this.genes[this.pointer];
            const RESULT = GENE.action(bot, GENE.property, GENE.branches);
            if (RESULT.goto) {
                this.pointer = RESULT.goto;
            } else {
                this.pointer++;
            }
            if (RESULT.completed) return;
        }
        bot.lastAction = { name: 'view-do-nothing', color: new Rgba(50, 50, 50, 255) };
        bot.color = bot.color.interpolate(new Rgba(100, 100, 100, 255), 0.1);
    }
}

type Gene = {
    action: ActionFn,
    property: number,
    branches: [number, number, number, number]
}