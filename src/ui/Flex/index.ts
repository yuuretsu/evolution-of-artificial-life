import styled from 'styled-components';

import type { CSSProperties } from 'react';

export interface IFlexProps {
  gap?: string | number;
  alignItems?: CSSProperties['alignItems'];
}

export const FlexRow = styled.div<IFlexProps>`
  display: flex;
  gap: ${({ gap }) => typeof gap === 'number' ? `${gap}px` : gap};
  align-items: ${({ alignItems }) => alignItems};
`;

export const FlexColumn = styled(FlexRow)`
  flex-direction: column;
`;
