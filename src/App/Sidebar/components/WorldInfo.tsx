import { observer } from "mobx-react";
import { FC } from "react";
import { Accordion, FlexColumn } from "ui";

export interface IWorldInformationProps {
  cycle: number;
  botsAmount: number;
  stepTime: number;
}

export const WorldInformation: FC<IWorldInformationProps> = observer((props) => {
  return (
    <Accordion name='Инфо о мире' defaultOpened>
      <FlexColumn>
        <span>Возраст: {(props.cycle / 1000).toFixed(1)} тыс. кадров</span>
        <span>Ботов: {props.botsAmount}</span>
        <span>Время обработки: {props.stepTime.toFixed(1)} мс.</span>
      </FlexColumn>
    </Accordion>
  )
});
