import { GENES } from 'shared/lib/genome';
import { Accordion, FlexColumn } from 'shared/ui';
import { GENES_NAMES, type GeneName } from 'shared/lib/genome/genes';
import { createToggleStore } from 'shared/lib/helpers';
import { useAccordionToggle } from 'shared/lib/hooks';

import type { ToggleStore } from 'shared/lib/helpers';
import type { FC } from 'react';

export const Legend: FC = () => {
  const genesWithDescription = Object.entries(GENES)
    .filter(([, geneTemplate]) => typeof geneTemplate.description === 'string');

  const accordionProps = useAccordionToggle(
    legendAccordion.$isEnabled,
    legendAccordion.toggle
  );

  return (
    <Accordion name="Легенда" {...accordionProps}>
      <FlexColumn gap={10}>
        {genesWithDescription
          .map(([key, geneTemplate]) => {
            const color = 'color' in geneTemplate
              ? geneTemplate
                .color
                ?.toString()
              : undefined;

            const accordionProps = useAccordionToggle(
              accordions[`legend::${key as GeneName}`].$isEnabled,
              accordions[`legend::${key as GeneName}`].toggle
            );

            return (
              <Accordion
                key={key}
                name={geneTemplate.name}
                color={color}
                isSmall
                {...accordionProps}
              >
                {geneTemplate.description}
              </Accordion>
            );
          })}
      </FlexColumn>
    </Accordion>
  );
};

const legendAccordion = createToggleStore(false);

const accordions = GENES_NAMES.reduce((acc, cur) => ({
  ...acc,
  [`legend::${cur}`]: createToggleStore(false)
}), {}) as Record<`legend::${GeneName}`, ToggleStore>;
