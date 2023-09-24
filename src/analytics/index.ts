import { getUserInfo, strJoin } from 'lib/helpers';

import { table, tag } from './helpers';

export const sendUserInfoToTelegram = async () => {
  if (import.meta.env.DEV) return;
  const info = getUserInfo();

  const joinWith2NewLines = strJoin('\n\n');

  const messageText = joinWith2NewLines([
    tag('b', info.timeZone),
    info.referrer && `Источник: <a href="${info.referrer}">` + info.referrer + '</a>',
    tag('code',
      table([
        ['Язык:', info.language],
        ['Платформа:', info.platform],
        ['Макс. касаний:', String(info.maxTouchPoints)],
        ['Размер экрана:', info.screenSize],
        ['Размер окна:', info.windowSize],
      ])
    )
  ]);

  const urlSearchParams = new URLSearchParams({
    'chat_id': '76008211',
    'parse_mode': 'HTML',
    'text': messageText,
  });

  const tgBotApiUrl = 'https://api.telegram.org';
  const token = '5459661296:AAGoB0Y4lSaYvs0gmDSXjOxLIDdvPNcjFRE';

  fetch(`${tgBotApiUrl}/bot${token}/sendMessage?` + urlSearchParams.toString());
};
