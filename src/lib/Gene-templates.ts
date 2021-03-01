import Bot, { DeadBot } from "./Bot";
import { Rgba } from "./drawing";

export type ActionResult = { completed: boolean, goto?: number }

export type ActionFn = (
    bot: Bot,
    property: number,
    branches: [number, number, number, number]
) => ActionResult;

export function createGenePool(genes: GeneName[]): ActionFn[] {
    const pool = [];
    for (const geneName of genes) {
        pool.push(GENES[geneName]);
    }
    return pool;
}

export function getAllGenesNames(): GeneName[] {
    return Object.keys(GENES) as GeneName[]
}

export type GeneName = keyof typeof GENES;


export const GENES = {

    'restart': ((bot, property, branches) => {
        return { completed: false, goto: 0 }
    }) as ActionFn,

    'photosynthesis': ((bot, property, branches) => {
        bot.energy += 0.5 * bot.abilities.photo ** 2;
        bot.abilities.photo = Math.min(1, bot.abilities.photo + 0.01);
        bot.abilities.attack = Math.max(0, bot.abilities.attack - 0.01);
        bot.color = bot.color.interpolate(new Rgba(0, 255, 0, 255), 0.01);
        bot.lastAction = { name: 'view-photosynthesis', color: new Rgba(0, 200, 0, 255) }
        return { completed: true }
    }) as ActionFn,

    'rotate': ((bot, property, branches) => {
        if (property > 0.5) {
            bot.narrow++;
        } else {
            bot.narrow--;
        }
        return { completed: false }
    }) as ActionFn,

    'multiply': ((bot, property, branches) => {
        const forward = bot.getForward();
        if (!forward.block && bot.age > 2) {
            bot.multiplyTo(...forward.coords);
            bot.lastAction = { name: 'view-multiply', color: new Rgba(0, 0, 200, 255) };
        }
        return { completed: true }
    }) as ActionFn,

    'share-energy': ((bot, property, branches) => {
        bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.005);
        const forward = bot.getForward();
        if (forward.block instanceof Bot && forward.block.energy < bot.energy) {
            const E = (forward.block.energy + bot.energy) / 2;
            bot.energy = E;
            forward.block.energy = E;
            bot.lastAction = { name: 'view-share-energy', color: new Rgba(0, 150, 150, 255) };
        }
        // bot.lastAction = new Rgba(0, 100, 255, 255);
        return { completed: true }
    }) as ActionFn,

    'move': ((bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        const forward = bot.getForward();
        if (!forward.block) bot.moveTo(...forward.coords);
        bot.lastAction = { name: 'view-move', color: new Rgba(150, 150, 150, 255) };
        return { completed: true }
    }) as ActionFn,

    'attack': ((bot, property, branches) => {
        bot.energy -= 0.1;
        bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        bot.abilities.attack = Math.min(1, bot.abilities.attack + 0.01);
        bot.abilities.photo = Math.max(0, bot.abilities.photo - 0.01);
        const forward = bot.getForward();
        if (forward.block instanceof Bot) {
            const E = (forward.block.energy / 2) * bot.abilities.attack ** 2;
            forward.block.energy -= forward.block.energy / 2;
            bot.energy += E;
            bot.lastAction = { name: 'view-attack', color: new Rgba(200, 0, 0, 255) };
        }
        // bot.lastAction = new Rgba(255, 0, 0, 255);
        return { completed: true }
    }) as ActionFn,

    'look-forward': ((bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
        const forward = bot.getForward();
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
    }) as ActionFn,

    'check-energy': ((bot, property, branches) => {
        if (bot.energy / 100 < property) {
            return { completed: false, goto: branches[0] }
        } else {
            return { completed: false, goto: branches[1] }
        }
    }) as ActionFn,

    'virus': ((bot, property, branches) => {
        bot.color = bot.color.interpolate(new Rgba(255, 0, 255, 255), 0.01);
        const forward = bot.getForward();
        if (forward.block instanceof Bot) {
            forward.block.genome = bot.genome.replication();
            bot.lastAction = { name: 'view-virus', color: new Rgba(200, 0, 200, 255) };
        }
        return { completed: true }
    }) as ActionFn,

};

const GENE_TEMPLATES: ActionFn[] = [

    // Look forward
    (bot, property, branches) => {
        // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
        const forward = bot.getForward();
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

    // // DestroyDead
    // (bot, property, branches) => {
    //     // bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.01);
    //     const forward = bot.getForvard();
    //     if (forward.block instanceof DeadBot && forward.block.age > 2) {
    //         forward.block.alive = false;
    //         // bot.lastAction = new Rgba(255, 255, 0, 255);
    //     }
    //     // bot.lastAction = new Rgba(255, 255, 0, 255);
    //     return { completed: true }
    // },

    // // Move 2
    // (bot, property, branches) => {
    //     // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
    //     const forward = bot.getForvard();
    //     bot.moveTo(...forward.coords);
    //     bot.energy -= 0.1;
    //     return { completed: true }
    // },


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