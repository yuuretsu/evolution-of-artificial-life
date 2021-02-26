import { Rgba } from "./drawing";
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

class DeadBot extends DynamicBlock {
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
    fillRandom(start: number = 0): this {
        for (let i = start; i < this.length; i++) {
            this.genes[i] = this.randGene();
        }
        return this;
    }
    create(genes: Gene[]): this {
        for (let i = 0; i < genes.length; i++) {
            this.genes[i] = genes[i];
        }
        this.fillRandom(genes.length);
        return this;
    }
    fillPlant(): this {
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
        bot.lastAction = { name: 'none', color: new Rgba(20, 20, 20, 255) };
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
        bot.color = bot.color.interpolate(new Rgba(100, 100, 100, 255), 0.1);
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
    // Restart
    (bot, property, branches) => {
        return { completed: false, goto: 0 }
    },

    // Photosynthesis
    (bot, property, branches) => {
        bot.energy += 0.5 * bot.abilities.photo ** 2;
        bot.abilities.photo = Math.min(1, bot.abilities.photo + 0.01);
        bot.abilities.attack = Math.max(0, bot.abilities.attack - 0.01);
        bot.color = bot.color.interpolate(new Rgba(0, 255, 0, 255), 0.01);
        bot.lastAction = { name: 'view-photosynthesis', color: new Rgba(0, 200, 0, 255) }
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
        if (!forward.block && bot.age > 2) {
            bot.multiplyTo(...forward.coords);
            bot.lastAction = { name: 'view-multiply', color: new Rgba(0, 0, 200, 255) };
        }
        // bot.lastAction = new Rgba(0, 0, 255, 255);
        return { completed: true }
    },

    // Share energy
    (bot, property, branches) => {
        bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.005);
        const forward = bot.getForvard();
        if (forward.block instanceof Bot && forward.block.energy < bot.energy) {
            const E = (forward.block.energy + bot.energy) / 2;
            bot.energy = E;
            forward.block.energy = E;
            bot.lastAction = { name: 'view-share-energy', color: new Rgba(0, 200, 200, 255) };
        }
        // bot.lastAction = new Rgba(0, 100, 255, 255);
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

    (bot, property, branches) => {
        if (bot.energy / 100 < property) {
            return { completed: false, goto: branches[0] }
        } else {
            return { completed: false, goto: branches[1] }
        }
    },

    // DestroyDead
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.01);
        const forward = bot.getForvard();
        if (forward.block instanceof DeadBot && forward.block.age > 2) {
            forward.block.alive = false;
            // bot.lastAction = new Rgba(255, 255, 0, 255);
        }
        // bot.lastAction = new Rgba(255, 255, 0, 255);
        return { completed: true }
    },

    // Move
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        const forward = bot.getForvard();
        if (!forward.block) bot.moveTo(...forward.coords);
        bot.lastAction = { name: 'view-move', color: new Rgba(200, 200, 200, 255) };
        return { completed: true }
    },

    // // Move 2
    // (bot, property, branches) => {
    //     // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
    //     const forward = bot.getForvard();
    //     bot.moveTo(...forward.coords);
    //     bot.energy -= 0.1;
    //     return { completed: true }
    // },

    // Kill
    (bot, property, branches) => {
        bot.energy -= 0.1;
        bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        bot.abilities.attack = Math.min(1, bot.abilities.attack + 0.01);
        bot.abilities.photo = Math.max(0, bot.abilities.photo - 0.01);
        const forward = bot.getForvard();
        if (forward.block instanceof Bot) {
            const E = (forward.block.energy / 2) * bot.abilities.attack ** 2;
            forward.block.energy -= forward.block.energy / 2;
            bot.energy += E;
            bot.lastAction = { name: 'view-attack', color: new Rgba(200, 0, 0, 255) };
        }
        // bot.lastAction = new Rgba(255, 0, 0, 255);
        return { completed: true }
    },

    // // Virus
    // (bot, property, branches) => {
    //     bot.color = bot.color.interpolate(new Rgba(255, 0, 255, 255), 0.01);
    //     const forward = bot.getForvard();
    //     if (forward.block instanceof Bot) {
    //         forward.block.genome = bot.genome.replication();
    //         bot.lastAction = new Rgba(255, 0, 255, 255);
    //     }
    //     return { completed: true }
    // }
];