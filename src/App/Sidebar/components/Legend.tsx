import { Rgba } from 'lib/color';
import { GENES } from 'lib/genome';
import { observer } from 'mobx-react';
import { Accordion, FlexColumn } from 'ui';

import type { FC } from 'react';

export const Legend: FC = observer(() => {
  return (
    <Accordion name='Легенда'>
      <FlexColumn gap={10}>
        {Object.entries(GENES)
          .filter(([, geneTemplate]) => typeof geneTemplate.description === 'string')
          .map(([key, geneTemplate]) =>
            <Accordion
              key={key}
              name={geneTemplate.name}
              color={geneTemplate.color?.interpolate(new Rgba(127, 127, 127, 255), 0.5).toString()}
              small
            >
              {geneTemplate.description}
            </Accordion>
          )}
      </FlexColumn>
    </Accordion>
  );
});