import styled from 'styled-components';

import type { CSSProperties } from 'react';

export interface IFlexProps {
  gap?: string | number;
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent']
}

export const FlexRow = styled.div.withConfig({
  shouldForwardProp: prop => !['alignItems', 'justifyContent'].includes(prop)
})<IFlexProps>`
  display: flex;
  gap: ${({ gap }) => typeof gap === 'number' ? `${gap}px` : gap};
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent}
`;

export const FlexColumn = styled(FlexRow)`
  flex-direction: column;
`;
