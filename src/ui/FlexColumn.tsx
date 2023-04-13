import styled from 'styled-components';

export interface IFlexColumnProps {
  gap?: string | number;
}

export const FlexColumn = styled.div<IFlexColumnProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => typeof gap === 'number' ? `${gap}px` : gap};
`;
