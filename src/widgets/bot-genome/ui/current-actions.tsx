import { hideScrollbar } from 'shared/styles';
import styled from 'styled-components';

import type { ActionResult, GeneTemplate } from 'shared/lib/genome/types';

type CurrentActionsProps = {
  actions: {
    template: GeneTemplate;
    result: ActionResult;
  }[];
}

export const CurrentActions = ({ actions }: CurrentActionsProps) => {
  return (
    <CurrentActionsWrapper>
      {actions.map(({ template, result }, i) => {
        return (
          <div key={i} style={{ fontSize: '80%' }}>
            - {result.msg || template.name}
          </div>
        );
      })}
    </CurrentActionsWrapper>
  );
};

const CurrentActionsWrapper = styled.div`
  aspect-ratio: 2;
  padding: 5px;
  border-radius: 5px;
  background-color: #333;
  overflow-y: auto;
  ${hideScrollbar}
`;
