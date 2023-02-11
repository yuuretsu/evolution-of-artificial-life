import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import VIEW_MODES, {
  initVisualizerParams,
  VisualiserParams
} from "lib/view-modes";
import Sidebar from "./Sidebar";
import Viewer from "./Viewer";
import {
  SquareWorld,
  World, WorldInfo, NewWorldProps
} from "lib/world";
import { WorldBlock } from "lib/block";
import {
  GENES, enabledGenesToPool
} from "lib/genome";
import { Controls } from "./Controls";
import { observer } from "mobx-react";
import { appStore } from "stores/app";
import { useEventListener, useInterval } from "usehooks-ts";

const initialEnabledGenes: { [geneName: string]: boolean } = {};
for (const name in GENES) {
  initialEnabledGenes[name] = GENES[name]!.defaultEnabled;
}

const initialGenePool = enabledGenesToPool(initialEnabledGenes);

const INIT_WORLD_PROPS: NewWorldProps = {
  width: Math.max(Math.floor((window.innerWidth - 300) / 8) - 6, 50),
  height: Math.max(Math.floor(window.innerHeight / 8) - 6, 50),
  botsAmount: 500,
  genePool: initialGenePool,
  genomeSize: 32,
};

const initWorld = new SquareWorld(INIT_WORLD_PROPS);
const initWorldInfo = initWorld.getInfo();
const initWorldImage = initWorld.toImage(() => null, initVisualizerParams);

const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

export const App: React.FC = observer(() => {
  const [appHeight, setAppHeight] = useState(window.innerHeight);
  const [visualizerParams, setVisualizerParams] = useState<VisualiserParams>(initVisualizerParams);
  const [newWorldProps, setNewWorldProps] = useState<NewWorldProps>(INIT_WORLD_PROPS);
  const [world, setWorld] = useState<World>(initWorld);
  const [image, setImage] = useState<HTMLCanvasElement>(initWorldImage);
  const [worldInfo, setWorldInfo] = useState<WorldInfo>(initWorldInfo);
  const [enabledGenes, setEnabledGenes] = useState(initialEnabledGenes);
  const [selectedBlock, setSelectedBlock] = useState<WorldBlock | null>(null);

  const currentViewMode = VIEW_MODES[appStore.viewModeName.current]!;

  const updateWorldView = () => {
    setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
    setWorldInfo(world.getInfo());
  };

  useEventListener("resize", () => setAppHeight(window.innerHeight));

  useEffect(updateWorldView, [currentViewMode.blockToColor, world, visualizerParams]);

  useEffect(() => {
    const newGenePool = enabledGenesToPool(enabledGenes);
    setNewWorldProps({
      ...newWorldProps,
      ...{ genePool: newGenePool }
    });
    world.genePool = newGenePool;
  }, [enabledGenes]);

  useInterval(() => {
    world.step();
    updateWorldView();
  }, appStore.isPaused ? null : appStore.timeBetweenSteps.current);

  const onClickStep = () => {
    appStore.isPaused
      ? world.step()
      : appStore.pause();
    updateWorldView();
  };

  const restart = () => {
    setWorld(new SquareWorld(newWorldProps));
    setSelectedBlock(null);
  };

  return (
    <Wrapper style={{ height: `${appHeight}px` }}>
      <Viewer
        image={image}
        world={world}
        onClickPixel={setSelectedBlock}
      />
      <Sidebar
        visualizerParams={visualizerParams}
        setVisualizerParams={setVisualizerParams}
        newWorldProps={newWorldProps}
        setNewWorldProps={setNewWorldProps}
        onChangeWorld={setWorld}
        world={world}
        worldInfo={worldInfo}
        enabledGenes={enabledGenes}
        setEnabledGenes={setEnabledGenes}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        onClickRestart={restart} />
      <Controls onClickStep={onClickStep} onClickRestart={restart} />
    </Wrapper>
  );
});
