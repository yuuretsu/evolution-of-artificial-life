import type { FC } from 'react';

export const DeadBotCard: FC = () => {
  return (
    <div
      style={{
        color: `rgb(${channels})`,
        backgroundColor: `rgba(${channels}, 0.1)`,
        fontWeight: 'bold',
        textAlign: 'center',
        border: `2px solid rgb(${channels})`,
        padding: '10px 0',
        borderRadius: '5px',
      }}
    >
      Этот бот мёртв
    </div>
  );
};

const channels = '255, 200, 0';
