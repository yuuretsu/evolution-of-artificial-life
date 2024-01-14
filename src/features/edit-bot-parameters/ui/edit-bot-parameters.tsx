import { InputNumberSmall, Table2Cols } from 'shared/ui';
import { useState, type FC, useEffect } from 'react';

import type { Bot } from 'shared/lib/bot';

interface EditBotParametersProps {
  bot: Bot,
}

export const EditBotParameters: FC<EditBotParametersProps> = ({ bot }) => {
  const [age, setAge] = useState<string>(String(bot.age));
  const [energy, setEnergy] = useState<string>(bot.energy.toFixed(2));
  const [health, setHealth] = useState<string>(bot.health.toFixed(2));

  useEffect(() => {
    setAge(String(bot.age));
  }, [bot.age]);

  useEffect(() => {
    setHealth(bot.health.toFixed(2));
  }, [bot.health]);

  useEffect(() => {
    setEnergy(bot.energy.toFixed(2));
  }, [bot.energy]);

  const narrowArrowStyle = {
    transform: `rotate(${bot.narrow.toFixed(1)}rad)`,
    display: 'inline-block'
  };

  return (
    <Table2Cols
      cells={[
        [
          'Возраст',
          <InputNumberSmall
            key={'age'}
            value={age}
            onChange={e => {
              const age = e.target.value;
              setAge(age);
            }}
            onBlur={e => {
              const age = e.target.value;
              if (age.length > 0) {
                bot.age = parseFloat(age);
              }
              setAge(String(bot.age));
            }}
          />
        ],
        [
          'Здоровье',
          <InputNumberSmall
            key='health'
            value={health}
            onChange={e => {
              const health = e.target.value;
              setHealth(health);
            }}
            onBlur={e => {
              const health = e.target.value;
              if (health.length > 0) {
                bot.health = parseFloat(health);
              }
              setHealth(String(bot.health));
            }}
          />
        ],
        [
          'Энергия',
          <InputNumberSmall
            key='energy'
            value={energy}
            onChange={e => {
              const energy = e.target.value;
              setEnergy(energy);
            }}
            onBlur={e => {
              const energy = e.target.value;
              if (energy.length > 0) {
                bot.energy = parseFloat(energy);
              }
              setEnergy(String(bot.energy));
            }}
          />
        ],
        [
          'Потомков',
          bot.childrenAmount,
        ],
        [
          'Направление',
          <div key={'narrow'} style={narrowArrowStyle}>→</div>,
        ],
        [
          'Поколение',
          bot.generation
        ]
      ]}
    />
  );
};
