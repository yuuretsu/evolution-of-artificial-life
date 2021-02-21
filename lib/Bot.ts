import { Rgba } from "./drawing";
import { fixNumber, limNumber, randChoice, randFloat, randInt } from "./math-functions";
import { Block, DynamicBlock, World } from "./world";

export default class Bot extends DynamicBlock {
    static amount = 0;
    private _narrow: number;
    age: number;
    constructor(
        world: World,
        x: number,
        y: number,
        color: Rgba,
        public energy: number,
        public genome: Genome,
        public family: Rgba
    ) {
        super(world, x, y, color);
        Bot.amount++;
        this._narrow = randInt(0, 8);
        this.age = 0;
    }
    set narrow(n: number) {
        this._narrow = fixNumber(0, 8, n);
    }
    get narrow(): number {
        return this._narrow;
    }
    narrowToCoords(): [number, number] {
        //   0 1 2
        //   7   3
        //   6 5 4
        const coords = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ];
        const x = this.x + coords[this.narrow][0];
        const y = this.y + coords[this.narrow][1];
        return [x, y];
    }
    getForvard() {
        const coords = this.world.fixCoords(...this.narrowToCoords());
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
            this.color,
            this.energy / 3,
            this.genome.replication(),
            this.family.mutateRgb(2)
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
        if (this.energy < 1 || this.age > 200) {
            this.alive = false;
            return;
        }
        this.genome.doAction(this);
        this.age += 1;
    }
    onDie() {
        Bot.amount--;
        new DeadBot(this);
    }
}

class DeadBot extends DynamicBlock {
    constructor(bot: Bot) {
        super(bot.world, bot.x, bot.y, bot.color.interpolate(new Rgba(0, 0, 0, 255), 0.5));
    }
    onStep() {
        this.color = this.color.interpolate(new Rgba(10, 10, 50, 255), 0.001);
    }
}

export class Genome {
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
            action: randChoice(GENE_TEMPLATES),
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
            action: Math.random() > 0.9 ? randChoice(GENE_TEMPLATES) : gene.action,
            property: limNumber(0, 1, gene.property + randFloat(-0.01, 0.01)),
            branches: gene.branches.map(
                i => Math.random() > 0.9
                    ? randInt(0, this.length)
                    : i
            ) as [number, number, number, number]
        }
    }
    fillRandom() {
        for (let i = 0; i < this.length; i++) {
            this.genes[i] = this.randGene();
        }
        return this;
    }
    fillPlant() {
        for (let i = 0; i < this.length; i++) {
            this.genes[i] = {
                action: GENE_TEMPLATES[randInt(0, 3)],
                property: Math.random(),
                branches: [
                    randInt(0, this.length),
                    randInt(0, this.length),
                    randInt(0, this.length),
                    randInt(0, this.length)
                ]
            };
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
    replication() {
        const genome = new Genome(this.length);
        for (let i = 0; i < this.length; i++) {
            genome.genes[i] = this.genes[i];
        }
        const pointer = randInt(0, genome.length);
        genome.genes[pointer] = this.mutateGene(this.genes[pointer]);
        return genome;
    }
    doAction(bot: Bot) {
        for (let i = 0; i < 20; i++) {
            const GENE: Gene = this.genes[this.pointer];
            const RESULT = GENE.action(bot, GENE.property, GENE.branches);
            if (RESULT.goto) {
                this.pointer = RESULT.goto;
            } else {
                this.pointer++;
            }
            if (RESULT.completed) break;
        }
    }
}

type ActionResult = { completed: boolean, goto?: number }

type ActionFn = (
    bot: Bot,
    property: number,
    branches: [number, number, number, number]
) => ActionResult;

type Gene = {
    action: ActionFn,
    property: number,
    branches: [number, number, number, number]
}

const GENE_TEMPLATES: ActionFn[] = [
    // Photosynthesis
    (bot, property, branches) => {
        bot.energy += 1;
        bot.color = bot.color.interpolate(new Rgba(0, 255, 0, 255), 0.01);
        return { completed: true }
    },
    // Rotate
    (bot, property, branches) => {
        if (property > 0.5) {
            bot.narrow++;
        } else {
            bot.narrow--;
        }
        return { completed: false }
    },
    // Multiply
    (bot, property, branches) => {
        const forward = bot.getForvard();
        if (!forward.block) {
            bot.multiplyTo(...forward.coords);
        }
        return { completed: true }
    },
    // Look forward
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
        const forward = bot.getForvard();
        if (forward.block instanceof Bot) {
            if (forward.block.family.difference(bot.color) < property) {
                return { completed: false, goto: branches[0] }
            } else {
                return { completed: false, goto: branches[1] }
            }
        } else if (forward.block instanceof DeadBot) {
            return { completed: false, goto: branches[2] }
        } else {
            return { completed: false, goto: branches[3] }
        }
    },
    // DestroyDead
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.01);
        const forward = bot.getForvard();
        if (forward.block instanceof DeadBot) {
            forward.block.alive = false;
        }
        return { completed: true }
    },
    // Move
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        const forward = bot.getForvard();
        if (!forward.block) bot.moveTo(...forward.coords);
        return { completed: true }
    },
    // Kill
    (bot, property, branches) => {
        bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        const forward = bot.getForvard();
        if (forward.block instanceof Bot) {
            forward.block.energy /= 3;
            bot.energy += forward.block.energy;
        }
        return { completed: true }
    },
];