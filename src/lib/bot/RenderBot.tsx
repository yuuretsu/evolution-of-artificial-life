import { useForceRender } from 'hooks';
import { useState, useEffect } from 'react';
import { accordionsStates } from 'stores/accordions';
import { SubBlock, FlexRow, FlexColumn, InputNumberSmall, Accordion } from 'ui';
import styled from 'styled-components';

import type { FC } from 'react';
import type { Bot } from './bot';

export const RenderBot: FC<{ bot: Bot }> = ({ bot }) => {
  const rerender = useForceRender();
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
          <div>
            <InputNumberSmall
              name='Возраст'
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
            <InputNumberSmall
              name='Здоровье'
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
            <InputNumberSmall
              name='Энергия'
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
            <div>Потомков: {bot.childrenAmount}</div>
            <div>
              Направление: <div style={narrowArrowStyle}>→</div>
            </div>
            <div>Поколение: {bot.generation}</div>
          </div>
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
      <Accordion
        name='Последние действия'
        isSmall
        {...accordionsStates.getProps('lastActions', { onToggle: rerender })}
      >
        <LastActionsWrapper>
          {bot.lastActions.map((action, i) => {
            return (
              <div key={i} style={{ fontSize: '80%' }}>
                - {action}
              </div>
            );
          })}
        </LastActionsWrapper>
      </Accordion>
    </>
  );
};

const channels = '255, 200, 0';

const LastActionsWrapper = styled.div`
  aspect-ratio: 1;
  padding: 5px;
  border-radius: 5px;
  background-color: #333;
  overflow-y: auto;
`;

const Avatar = styled.div`
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
`;
