import { css } from 'styled-components';

export const panel = css`
  background-color: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(50px) saturate(2);
`;

export const hideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
