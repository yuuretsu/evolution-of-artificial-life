import { GENES } from "lib/genome";
import { observer } from "mobx-react";
import { FC } from "react";
import { Accordion, Checkbox, FlexColumn, SubBlock, WideButton } from "ui";

export interface ICurrentWorldSettingsProps {
  enabledGenes: Record<string, boolean>;
  onChangeEnabledGenes: (value: Record<string, boolean>) => void;
}

export const CurrentWorldSettings: FC<ICurrentWorldSettingsProps> = observer((props) => {
  const enableDefaultGenes = () => {
    const entries = Object.entries(props.enabledGenes);
    const resultEntries = entries.map(([k]) => [k, !!GENES[k]?.defaultEnabled]);
    props.onChangeEnabledGenes(Object.fromEntries(resultEntries))
  };

  const disableAllGenes = () => {
    props.onChangeEnabledGenes(Object.fromEntries(Object.entries(props.enabledGenes).map(([k]) => [k, false])))
  };

  return (
    <Accordion name='Настройки мира' defaultOpened>
      <SubBlock name="Генофонд">
        <FlexColumn gap={10}>
          <FlexColumn gap={5}>
            {Object.keys(props.enabledGenes).map(key => {
              return (
                <Checkbox
                  title={GENES[key]!.name}
                  value={key}
                  key={key}
                  checked={props.enabledGenes[key]}
                  onChange={(value, checked) => {
                    const newEnabledGenes = { ...props.enabledGenes };
                    newEnabledGenes[value] = checked;
                    props.onChangeEnabledGenes(newEnabledGenes)
                  }}
                />
              )
            })}
          </FlexColumn>
          <FlexColumn gap={5}>
            <WideButton onClick={enableDefaultGenes}>
              Вернуть стандартные
            </WideButton>
            <WideButton onClick={disableAllGenes}>
              Выключить все
            </WideButton>
          </FlexColumn>
        </FlexColumn>
      </SubBlock>
    </Accordion>
  )
});