import { FlexRow, FlexColumn } from 'shared/ui';
import styled from 'styled-components';
import { EditBotParameters } from 'features/edit-bot-parameters';

import { DeadBotCard } from './dead-bot-card';

import type { Bot } from 'shared/lib/bot';
import type { FC } from 'react';

export const BotProfile: FC<{ bot: Bot }> = ({ bot }) => {
  return (
    <>
      <FlexRow alignItems='center' gap={10}>
        <Avatar style={{ backgroundColor: bot.getInformativeColor()?.toString() }} />
        <b>Бот</b>
      </FlexRow>
      <FlexColumn gap={10}>
        <EditBotParameters bot={bot} />
        {!bot.isAlive && (
          <DeadBotCard />
        )}
      </FlexColumn>
      <bot.genome.Render />
    </>
  );
};

const Avatar = styled.div`
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
`;
