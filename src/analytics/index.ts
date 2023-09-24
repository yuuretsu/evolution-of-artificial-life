import { getUserInfo } from 'lib/helpers';

import { table, tag } from './helpers';

export const sendUserInfoToTelegram = async () => {
  if (import.meta.env.DEV) return;
  const info = getUserInfo();

  const messageText =
    tag('b', info.timeZone) + '\n\n' +
    `Источник: <a href="${'vk.com'}">` + info.referrer + '</a>\n\n' +
    tag('code', table([
      ['Язык:', info.language],
      ['Платформа:', info.platform],
      ['Макс. касаний:', String(info.maxTouchPoints)],
      ['Размер экрана:', info.screenSize],
      ['Размер окна:', info.windowSize],
    ]).toString());

  const urlSearchParams = new URLSearchParams({
    'chat_id': '76008211',
    'parse_mode': 'HTML',
    'text': messageText,
  });

  const tgBotApiUrl = 'https://api.telegram.org';
  const token = '5459661296:AAGoB0Y4lSaYvs0gmDSXjOxLIDdvPNcjFRE';

  fetch(
    `${tgBotApiUrl}/bot${token}/sendMessage?` + urlSearchParams.toString()
  );
};
