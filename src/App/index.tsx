import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import VIEW_MODES, { viewModesList, VisualiserParams } from "lib/view-modes";
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
import Controls from "./Controls";
import { observer } from "mobx-react";
import { appStore } from "stores/app";

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
const initVisualizerParams: VisualiserParams = {
  ageDivider: 1000,
  energyDivider: 100,
  action: {}
};

Object
  .keys(GENES)
  .map(geneName => {
    if (GENES[geneName]?.color !== null) {
      initVisualizerParams.action[GENES[geneName]!.name] = true;
    }
  });


const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

const App = observer(() => {
  const [appHeight, setAppHeight] = useState(window.innerHeight);
  const [visualizerParams, setVisualizerParams] = useState<VisualiserParams>(initVisualizerParams);
  const [newWorldProps, setNewWorldProps] = useState<NewWorldProps>(INIT_WORLD_PROPS);
  const [world, setWorld] = useState<World>(initWorld);
  const [image, setImage] = useState<HTMLCanvasElement | null>(null);
  const [worldInfo, setWorldInfo] = useState<WorldInfo>(initWorldInfo);
  const [enabledGenes, setEnabledGenes] = useState(initialEnabledGenes);
  const [selectedBlock, setSelectedBlock] = useState<WorldBlock | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setAppHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newGenePool = enabledGenesToPool(enabledGenes);
    setNewWorldProps({
      ...newWorldProps,
      ...{ genePool: newGenePool }
    });
    world.genePool = newGenePool;
    setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
    setWorldInfo(world.getInfo());
    if (!appStore.isPaused) {
      let id = setInterval(() => {
        world.step();
        setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
        setWorldInfo(world.getInfo());
      });
      console.log(
        `%c -> start loop (id: ${id}) `,
        'background: #eee; color: #314c4e;'
      );
      return () => {
        clearInterval(id);
        console.log(
          `%c -| stop loop (id: ${id}) `,
          'background: #eee; color: #314c4e;'
        );
      };
    }
  }, [appStore.viewMode.current, appStore.isPaused, world, visualizerParams, enabledGenes]);

  const currentViewMode = VIEW_MODES[appStore.viewMode.current]!;

  return (
    <Wrapper style={{ height: `${appHeight}px` }}>
      {image && <Viewer
        viewMode={appStore.viewMode.current}
        image={image}
        world={world}
        setSelectedBlock={setSelectedBlock}
      />}
      <Sidebar
        setViewMode={appStore.viewMode.set}
        visualizerParams={visualizerParams}
        setVisualizerParams={setVisualizerParams}
        newWorldProps={newWorldProps}
        setNewWorldProps={setNewWorldProps}
        setWorld={setWorld}
        world={world}
        worldInfo={worldInfo}
        enabledGenes={enabledGenes}
        setEnabledGenes={setEnabledGenes}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
      />
      <Controls
        onClickStep={() => {
          world.step();
          appStore.pause();
          setImage(world.toImage(currentViewMode.blockToColor, visualizerParams));
          setWorldInfo(world.getInfo());
        }}
      />
    </Wrapper>
  );
});

export default App;