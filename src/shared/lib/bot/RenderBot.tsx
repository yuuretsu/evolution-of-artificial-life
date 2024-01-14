import { useState, useEffect } from 'react';
import { SubBlock, FlexRow, FlexColumn, InputNumberSmall, Table2Cols } from 'shared/ui';
import styled from 'styled-components';

import type { FC } from 'react';
import type { Bot } from './bot';

export const RenderBot: FC<{ bot: Bot }> = ({ bot }) => {
  const [age, setAge] = useState<number | string>(bot.age);
  const [energy, setEnergy] = useState<number | string>(bot.energy.toFixed(2));
  const [health, setHealth] = useState<number | string>(bot.health.toFixed(2));

  useEffect(() => {
    setAge(bot.age);
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
    <>
      <SubBlock>
        <FlexRow alignItems='center' gap={10}>
          <Avatar style={{ backgroundColor: bot.getInformativeColor()?.toString() }} />
          <b>Бот</b>
        </FlexRow>
      </SubBlock>
      <SubBlock>
        <FlexColumn gap={10}>
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
                    setAge(bot.age);
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
                    setHealth(bot.health);
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
                    setEnergy(bot.energy);
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
          {!bot.isAlive && (
            <div
              style={{
                color: `rgb(${channels})`,
                backgroundColor: `rgba(${channels}, 0.1)`,
                fontWeight: 'bold',
                textAlign: 'center',
                border: `2px solid rgb(${channels})`,
                // lineHeight: '50px',
                padding: '10px 0',
                borderRadius: '5px',
              }}
            >
              Этот бот мёртв
            </div>
          )}
        </FlexColumn>
      </SubBlock>
      <SubBlock>
        <bot.genome.Render />
      </SubBlock>
    </>
  );
};

const channels = '255, 200, 0';

const Avatar = styled.div`
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
`;
