import { createGlobalStyle, css } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    overflow: hidden;
    background-color: black;
  }
`;

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
