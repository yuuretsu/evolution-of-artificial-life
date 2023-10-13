import { GENES } from 'lib/genome';
import { observer } from 'mobx-react';
import { Accordion, FlexColumn } from 'ui';
import { accordionsStates } from 'stores/accordions';

import type { GeneName } from 'lib/genome/genes';
import type { FC } from 'react';

export const Legend: FC = observer(() => {
  const genesWithDescription = Object.entries(GENES)
    .filter(([, geneTemplate]) => typeof geneTemplate.description === 'string');

  return (
    <Accordion name="Легенда" {...accordionsStates.getProps('legend')}>
      <FlexColumn gap={10}>
        {genesWithDescription
          .map(([key, geneTemplate]) => {
            const color = 'color' in geneTemplate
              ? geneTemplate
                .color
                .toString()
              : undefined;
            return (
              <Accordion
                key={key}
                name={geneTemplate.name}
                color={color}
                isSmall
                {...accordionsStates.getProps(`legend::${key as GeneName}`)}
              >
                {geneTemplate.description}
              </Accordion>
            );
          })}
      </FlexColumn>
    </Accordion>
  );
});
