import { DropdownSmall, FlexColumn, FlexRow, InputNumberSmall, OptionalBlock, Table2Cols } from 'shared/ui';
import styled from 'styled-components';
import { GENES } from 'shared/lib/genome';
import { NULL_GENE_TEMPLATE } from 'shared/lib/genome/gene';
import { type ReactNode } from 'react';
import { cycleNumber, limit } from 'shared/lib/helpers';
import { useForceRender } from 'shared/lib/hooks';

import type { ChangeEventHandler, FocusEventHandler } from 'react';
import type { Gene } from 'shared/lib/genome';

interface EditGeneProps {
  gene: Gene,
  genomeLength: number,
  onChange?: () => void,
}

export const EditGene = ({ gene, genomeLength, onChange }: EditGeneProps) => {
  const rerender = useForceRender();

  const handleChange = () => {
    rerender();
    onChange?.();
  };

  const handleChangeGene = (id: string) => {
    gene.template = GENES[id] || NULL_GENE_TEMPLATE;
    handleChange();
  };

  const getBranchChangeHandler = (i: number): ChangeEventHandler<HTMLInputElement> => (e) => {
    const value = e.target.value;
    const newBranches = [...gene.property.branches];
    newBranches[i] = Number(value);
    handleChange();
  };

  const getBranchBlurHandler = (i: number): FocusEventHandler<HTMLInputElement> => (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      gene.property.branches[i] = cycleNumber(
        0,
        genomeLength,
        parseInt(value)
      );
    }
    handleChange();
  };

  const handleBlurParameter: FocusEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      gene.property.option = limit(
        0,
        1,
        parseFloat(value)
      );
    }
    handleChange();
  };

  const geneOptions = (Object.keys(GENES)).map(key => {
    const gene = GENES[key]!;
    const color = 'color' in gene ? gene.color : undefined;
    return {
      value: key,
      title: (
        <FlexRow gap={5} alignItems='center'>
          <SelectOptionGeneIcon color={color?.toString() || 'rgb(127, 127, 127, 0.1)'} />
          {GENES[key]?.name || NULL_GENE_TEMPLATE.name}
        </FlexRow>
      )
    };
  });

  return (
    <FlexColumn gap={5}>
      <DropdownSmall
        value={gene.template.id}
        options={geneOptions}
        onChange={handleChangeGene}
      />
      {gene.template.description && (
        <OptionalBlock>
          {gene.template.description}
        </OptionalBlock>
      )}
      <Table2Cols
        cells={[
          [
            <LabelName isNamed={!!gene.template.translation?.option} key={0}>
              {gene.template.translation?.option || 'Параметр'}
            </LabelName>,
            <InputNumberSmall
              key={1}
              value={gene.property.option.toString()}
              onChange={handleChange}
              onBlur={handleBlurParameter}
            />
          ],
          ...gene
            .property
            .branches
            .map((_, i): [ReactNode, ReactNode] => {
              const name = gene.template.translation?.branches?.[i];
              return [
                <LabelName isNamed={!!name} key={0}>
                  {name || `${i + 1} ветка`}
                </LabelName>,
                <InputNumberSmall
                  key={i}
                  value={gene.property.branches[i]}
                  onChange={getBranchChangeHandler(i)}
                  onBlur={getBranchBlurHandler(i)}
                />
              ];
            })
        ]}
      />
    </FlexColumn>
  );
};

const LabelName = styled.span<{ isNamed: boolean }>`
  opacity: ${props => props.isNamed ? 1 : 0.5};
`;

const SelectOptionGeneIcon = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  background-color: ${props => props.color};
`;
