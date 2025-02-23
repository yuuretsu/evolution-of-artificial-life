import { Rgba } from 'shared/lib/color';
import { lerp } from 'shared/lib/helpers';

import type { GeneTemplate } from './types';

export const GENES_ARR = [
  {
    id: 'doNothing',
    name: 'Отдых',
    description: 'Прибавляет 0,1 к здоровью',
    color: new Rgba(100, 100, 0),
    colorInfluence: 0.01,
    action: ({ bot }) => {
      const value = 0.1;
      bot.health = Math.min(1, bot.health + 0.1);
      return { isCompleted: true, msg: `Лечение +${value}` };
    },
  } as const,
  {
    id: 'multiply',
    name: 'Размножение',
    description: 'Бот теряет 1/10 энергии на попытку размножения. Если клетка перед ним пуста, энергии больше 5 единиц, а возраст больше 10 кадров, бот размножается. Потомку передается количество энергии, равное параметру гена, такое же количество вычитается из собственной энергии.',
    color: new Rgba(255, 255, 200),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world, property }) => {
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      bot.energy *= 0.9;
      if (frontBlock) return { isCompleted: true, msg: 'Размножение не удалось: спереди блок' };
      if (bot.energy <= 5) return { isCompleted: true, msg: 'Размножение не удалось: мало энергии' };
      if (bot.age <= 10) return { isCompleted: true, msg: 'Размножение не удалось: бот слишком молод' };
      world.set(...frontCoords, bot.multiply(world.genePool.map(geneNameToGene), property.option));
      return { isCompleted: true, msg: 'Размножение' };
    },
    translation: {
      option: 'Передать энергии',
    },
  } as const,
  {
    id: 'rotate',
    name: 'Поворот',
    description: 'Бот поворачивается по часовой стрелке, если параметр гена > 0,5, иначе против часовой стрелки',
    action: ({ bot, property }) => {
      const angle = Math.PI * 2 / 8;

      bot.narrow += property.option > 0.5
        ? angle
        : -angle;

      return { msg: `Поворот ${property.option > 0.5 ? 'направо' : 'налево'}` };
    },
    translation: {
      option: 'Направо/налево',
    }
  } as const,
  {
    id: 'photosynthesis',
    name: 'Фотосинтез',
    description: 'Бот получает энергию путем фотосинтеза. При этом эффективность его фотосинтеза возрастает, а эффективность атак — падает. Восстанавливает своё здоровье на 0,01.',
    color: new Rgba(0, 255, 0),
    colorInfluence: 0.01,
    action: ({ bot, world, x, y }) => {
      const energy = world.getSunlight(x, y) * (1 - bot.hunterFactor) ** 2;
      bot.energy += energy;
      bot.increaseHunterFactor(-0.01);
      bot.health = Math.min(1, bot.health + 0.01);
      return { isCompleted: true, msg: `Фототсинтез: +${energy.toFixed(2)} энергии` };
    }
  } as const,
  {
    id: 'attack',
    name: 'Атака',
    description: 'Бот атакует блок перед собой, забирая себе часть его энергии.Повышает здоровье на 0,01.',
    color: new Rgba(255, 0, 0),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world, property }) => {
      bot.energy -= 0.5;
      const frontBlock = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      if (!frontBlock) return { isCompleted: true, msg: 'Атака не удалась' };
      const value = lerp(0, 5, property.option) * bot.hunterFactor ** 2;
      const result = frontBlock.onAttack(value);
      bot.energy += result;
      bot.increaseHunterFactor(0.01);
      bot.health = Math.min(1, bot.health + 0.01);
      return { isCompleted: true, msg: `Атака: +${result.toFixed(2)} энергии` };
    },
    translation: {
      option: 'Сила атаки',
    }
  } as const,
  {
    id: 'virus',
    name: 'Заразить геном',
    description: 'Бот копирует с свой геном в бота напротив, при этом есть шанс мутации. Расходует 0,1 здоровья и 0,1 энергии.',
    isDefaultDisabled: true,
    color: new Rgba(255, 50, 255),
    colorInfluence: 0.05,
    action: ({ bot, x, y, world }) => {
      bot.health -= 0.99;
      bot.energy -= 0.1;
      const frontBlock = world.get(
        ...world.narrowToCoords(x, y, bot.narrow, 1)
      );
      if (!frontBlock) return { isCompleted: true, msg: 'Заражение не удалось' };
      const genome = bot.genome.replication(world.genePool.map(geneNameToGene));
      frontBlock.onVirus(genome, bot.familyColor.mutateRgb(5));
      return { isCompleted: true, msg: 'Заражение другого бота' };
    }
  } as const,
  {
    id: 'moveForward',
    name: 'Двигаться вперед',
    description: 'Бот перемещется в клетку перед собой, если она пустая. Расходует 0,5 энергии.',
    color: new Rgba(200, 200, 200),
    action: ({ bot, x, y, world }) => {
      bot.energy -= 0.5;
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      if (frontBlock) return { isCompleted: true, msg: 'Передвижение не удалось' };
      world.swap(x, y, ...frontCoords);
      return { isCompleted: true, msg: 'Передвижение' };
    }
  } as const,
  {
    id: 'push',
    name: 'Толкнуть',
    description: 'Бот отталкивает блок перед собой на одну клетку, если клетка за ним пуста. Расходует 0,5 энергии.',
    color: new Rgba(100, 0, 255),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world }) => {
      bot.energy -= 0.5;
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      const otherCoords = world.narrowToCoords(x, y, bot.narrow, 2);
      const otherBlock = world.get(...otherCoords);

      if (!frontBlock || otherBlock) return { isCompleted: true, msg: 'Не удалось толкнуть другой объект' };
      world.swap(...frontCoords, ...otherCoords);
      return { isCompleted: true, msg: 'Толкнул другой объект' };
    }
  } as const,
  {
    id: 'pull',
    name: 'Тянуть',
    description: 'Бот притягивает блок перед собой. Расходует 0,5 энергии.',
    color: new Rgba(0, 0, 255),
    colorInfluence: 0.01,
    action: ({ bot, x, y, world }) => {
      bot.energy -= 0.5;
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      const otherCoords = world.narrowToCoords(x, y, bot.narrow, 2);
      const otherBlock = world.get(...otherCoords);

      if (frontBlock || !otherBlock) return { isCompleted: true, msg: 'Не удалось притянуть другой объект' };
      world.swap(...frontCoords, ...otherCoords);
      return { isCompleted: true, msg: 'Притянул другой объект' };
    }
  } as const,
  {
    id: 'swap',
    name: 'Меняться местами',
    description: 'Бот меняется местами с клеткой перед собой, расходуя при этом 1 энергии.',
    isDefaultDisabled: true,
    color: new Rgba(255, 255, 255),
    action: ({ bot, x, y, world }) => {
      bot.energy -= 1;
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      world.swap(...frontCoords, x, y);
      return { isCompleted: true, msg: 'Поменялся местами с другой клеткой' };
    }
  } as const,
  {
    id: 'goto',
    name: 'Переместить указатель',
    description: 'Следующая команда генома будет той, которая указана в ветке 1 текущего гена.',
    action: ({ property }) => {
      const goto = property.branches[0];
      const msg = `Перенос указателя → ${goto}`;
      return { goto, msg };
    },
    translation: {
      branches: ['На индекс']
    }
  } as const,
  {
    id: 'checkHealth',
    name: 'Проверить здоровье',
    description: 'Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если здоровье бота меньше, чем параметр текущего гена.Иначе следующая команда берется из ветки 2.',
    action: ({ bot, property }) => {
      if (bot.health < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка здоровья → ${goto}`;
        return { goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка здоровья → ${goto}`;
      return { goto, msg };
    },
    translation: {
      option: 'Порог',
      branches: ['Если меньше', 'Если больше']
    }
  } as const,
  {
    id: 'checkEnergy',
    name: 'Проверить энергию',
    description: 'Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если энергия бота меньше, чем параметр текущего гена, умноженный на 300. Иначе следующая команда берется из ветки 2.',
    action: ({ bot, property }) => {
      if (bot.energy / 300 < property.option) {
        const goto = property.branches[0];
        const msg = `Проверка энергии → ${goto}`;
        return { goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Проверка энергии → ${goto}`;
      return { goto, msg };
    },
    translation: {
      option: 'Порог',
      branches: ['Если меньше', 'Если больше']
    }
  } as const,
  {
    id: 'forward',
    name: 'Спереди блок?',
    description: 'Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом есть пустая клетка.Иначе следующая команда берется из ветки 2.',
    action: ({ bot, x, y, world, property }) => {
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      if (frontBlock) {
        const goto = property.branches[0];
        const msg = `Спереди блок → ${goto}`;
        return { goto, msg };
      }
      const goto = property.branches[1];
      const msg = `Спереди нет блока → ${goto}`;
      return { goto, msg };
    },
    translation: {
      branches: ['Если есть', 'Если нет']
    }
  } as const,
  {
    id: 'compareFamilies',
    name: 'Спереди родственник?',
    description: 'Следующая команда генома будет той, на которую указывает ветка 1 текущего гена, если перед ботом находится родственник. Иначе следующая команда берется из ветки 2.',
    action: ({ bot, x, y, world, property }) => {
      const frontCoords = world.narrowToCoords(x, y, bot.narrow, 1);
      const frontBlock = world.get(...frontCoords);
      if (frontBlock) {
        const familyColor = frontBlock.getFamilyColor();
        if (
          familyColor !== null &&
          familyColor.difference(bot.familyColor) > property.option
        ) {
          const goto = property.branches[0];
          const msg = `Спереди родственник → ${goto}`;
          return { goto, msg };
        }
      }
      const goto = property.branches[1];
      const msg = `Спереди нет родственника → ${goto}`;
      return { goto, msg };
    },
    translation: {
      option: 'Порог',
      branches: ['Если есть', 'Если нет']
    }
  } as const,
] satisfies GeneTemplate[];

export const GENES: Record<string, GeneTemplate> = GENES_ARR.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});

export type GeneName = (typeof GENES_ARR)[number]['id'];

export const GENES_NAMES = Object.keys(GENES) as GeneName[];

export const geneNameToGene = (name: GeneName) => GENES[name]!;

export const INITIALLY_ENABLED_GENES_NAMES = GENES_ARR.filter(gene => !gene.isDefaultDisabled).map(gene => gene.id);