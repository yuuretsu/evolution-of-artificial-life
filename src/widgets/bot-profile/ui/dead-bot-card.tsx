import { FaSkull } from 'react-icons/fa';

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <FaSkull size={24} />
      <div>
        Этот бот мёртв
      </div>
    </div>
  );
};

const channels = '255, 200, 0';
