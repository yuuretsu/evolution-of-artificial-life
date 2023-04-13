import Rgba from "lib/color";
import { GenePool, GeneTemplate } from "./types";
import { interpolate } from "lib/helpers";

export function enabledGenesToPool(genes: Record<string, boolean>): GenePool {
  return namesToGenePool(
    Object
      .keys(genes)
      .filter(key => genes[key])
  );
}

function namesToGenePool(names: string[]): GenePool {
  return names.reduce<GenePool>((pool, name) => {
    const gene = GENES[name];
    return gene ? [...pool, gene] : pool;
  }, []);
}

export const GENES: { [index: string]: GeneTemplate } = {
  doNothing: {
    name: 'Отдых',
    description: `Прибавляет 0,1 к здоровью`,
    defaultEnabled: true,
    color: new Rgba(100, 100, 0, 255),
    colorInfluence: 0.01,
    action: ({ bot }) => {
      const value = 0.1;
      bot.health = Math.min(1, bot.health + 0.1);
      return { completed: true, goto: null, msg: `Лечение +${value}` };
    }
  },
  multiply: {
    name: 'Размножение',
    description: `Бот теряет 1/10 энергии на попытку размножения. Если клетка перед ним пуста, энергии больше 5 единиц, а возраст больше 10 кадров, бот размножается. Потомку передается количество энергии, равное параметру гена, такое же количество вычитается из собственной энергии.`,
    defaultEnabled: true,
    color: new Rgba(255, 255, 200, 255),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world, property }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      bot.energy *= 0.9;
      if (F_BLOCK) return { completed: true, goto: null, msg: `Размножение не удалось: спереди блок` };
      if (bot.energy <= 5) return { completed: true, goto: null, msg: `Размножение не удалось: мало энергии` };
      if (bot.age <= 10) return { completed: true, goto: null, msg: `Размножение не удалось: бот слишком молод` };
      world.set(...F_COORDS, bot.multiply(world.genePool, property.option));
      return { completed: true, goto: null, msg: `Размножение` };
    }
  },
  rotate: {
    name: 'Поворот',
    description: `Бот поворачивается по часовой стрелке, если параметр гена > 0,5, иначе против часовой стрелки`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ bot, property }) => {
      bot.narrow = property.option > 0.5
        ? bot.narrow + 1
        : bot.narrow - 1
      return { completed: false, goto: null, msg: `Поворот ${property.option > 0.5 ? 'направо' : 'налево'}` };
    }
  },
  photosynthesis: {
    name: 'Фотосинтез',
    description: `Бот получает энергию путем фотосинтеза. При этом эффективность его фотосинтеза возрастает, а эффективность атак — падает. Восстанавливает своё здоровье на 0,01.`,
    defaultEnabled: true,
    color: new Rgba(0, 255, 0, 255),
    colorInfluence: 0.01,
    action: ({ bot }) => {
      const energy = 1 * bot.abilities.photosynthesis ** 2;
      bot.energy += energy;
      bot.increaseAbility('photosynthesis');
      bot.health = Math.min(1, bot.health + 0.01);
      return { completed: true, goto: null, msg: `Фототсинтез: +${energy.toFixed(2)} энергии` };
    }
  },
  attack: {
    name: 'Атака',
    description: `Бот атакует блок перед собой, забирая себе часть его энергии.Повышает здоровье на 0,01.`,
    defaultEnabled: true,
    color: new Rgba(255, 0, 0, 255),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world, property }) => {
      const F_BLOCK = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      let msg: string;
      if (F_BLOCK) {
        const value = interpolate(0, 5, property.option) * bot.abilities.attack ** 2;
        const result = F_BLOCK.onAttack(value);
        bot.energy += result;
        bot.increaseAbility('attack');
        bot.health = Math.min(1, bot.health + 0.01);
        msg = `Атака: +${result.toFixed(2)} энергии`;
      } else {
        msg = `Атака не удалась`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  virus: {
    name: 'Заразить геном',
    description: `Бот копирует с свой геном в бота напротив, при этом есть шанс мутации. Расходует 0,1 здоровья и 0,1 энергии.`,
    defaultEnabled: false,
    color: new Rgba(255, 50, 255, 255),
    colorInfluence: 0.05,
    action: ({ bot, x, y, world }) => {
      const F_BLOCK = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      let msg: string;
      if (F_BLOCK) {
        const genome = bot.genome.replication(world.genePool);
        F_BLOCK.onVirus(genome, bot.familyColor.mutateRgb(5));
        msg = `Заражение другого бота`;
      } else {
        msg = `Заражение не удалось`;
      }
      bot.health -= 0.1;
      bot.energy -= 0.1;
      return { completed: true, goto: null, msg };
    }
  },
  moveForward: {
    name: 'Двигаться вперед',
    description: `Бот перемещется в клетку перед собой, если она пустая. Расходует 0,5 энергии.`,
    defaultEnabled: true,
    color: new Rgba(200, 200, 200, 255),
    colorInfluence: null,
    action: ({ bot, x, y, world }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      let msg: string;
      if (!F_BLOCK) {
        world.swap(x, y, ...F_COORDS);
        msg = `Передвижение`;
      } else {
        msg = `Передвижение не удалось`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  push: {
    name: 'Толкнуть',
    description: `Бот отталкивает блок перед собой на одну клетку, если клетка за ним пуста. Расходует 0,5 энергии.`,
    defaultEnabled: true,
    color: new Rgba(0, 0, 255, 255),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      const O_COORDS = world.narrowToCoords(x, y, bot.narrow, 2);
      const O_BLOCK = world.get(...O_COORDS);
      let msg: string;
      if (F_BLOCK && !O_BLOCK) {
        world.swap(...F_COORDS, ...O_COORDS);
        msg = `Толкнул другой объект`;
      } else {
        msg = `Не удалось толкнуть другой объект`;
      }
      bot.energy -= 0.5;
      return { completed: true, goto: null, msg };
    }
  },
  swap: {
    name: 'Меняться местами',
    description: `Бот меняется местами с клеткой перед собой, расходуя при этом 1 энергии.`,
    defaultEnabled: false,
    color: new Rgba(255, 255, 255, 255),
    colorInfluence: null,
    action: ({ bot, x, y, world }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      world.swap(...F_COORDS, x, y);
      bot.energy -= 1;
      return { completed: true, goto: null, msg: `Поменялся местами с другой клеткой` };
    }
  },
  movePointer: {
    name: 'Переместить указатель',
    description: `Следующая команда генома будет той, которая указана в ветке 1 текущего гена.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ property }) => {
      const goto = property.branches[0];
      const msg = `Перенос указателя → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  checkHealth: {
    name: 'Проверить здоровье',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если здоровье бота меньше, чем параметр текущего гена.Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ bot, property }) => {
      if (bot.health < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка здоровья → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка здоровья → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  checkEnergy: {
    name: 'Проверить энергию',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если энергия бота меньше, чем параметр текущего гена, умноженный на 300. Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ bot, property }) => {
      if (bot.energy / 300 < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка энергии → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка энергии → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  forward: {
    name: 'Спереди блок?',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом есть пустая клетка.Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ bot, x, y, world, property }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      if (F_BLOCK) {
        const goto = property.branches[0];
        const msg = `Спереди блок → ${goto}`;
        return { completed: false, goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Спереди нет блока → ${goto}`;
      return { completed: false, goto, msg };
    }
  },
  compareFamilies: {
    name: 'Спереди родственник?',
    description: `Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом находится родственник. Иначе следующая команда берется из ветки 2.`,
    defaultEnabled: true,
    color: null,
    colorInfluence: null,
    action: ({ bot, x, y, world, property }) => {
      const F_COORDS = world.narrowToCoords(x, y, bot.narrow, 1);
      const F_BLOCK = world.get(...F_COORDS);
      if (F_BLOCK) {
        const familyColor = F_BLOCK.getFamilyColor();
        if (
          familyColor !== null &&
          familyColor.difference(bot.familyColor) > property.option
        ) {
          const goto = property.branches[0];
          const msg = `Спереди родственник → ${goto}`;
          return { completed: false, goto, msg };
        }
      }
      const goto = property.branches[1];
      const msg = `Спереди нет родственника → ${goto}`;
      return { completed: false, goto, msg };
    }
  }
};