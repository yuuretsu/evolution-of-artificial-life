import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import VIEW_MODES, { VisualiserParams } from "../lib/view-modes";
import Sidebar from "./Sidebar";
import Viewer from "./Viewer";
import {
  SquareWorld,
  World, WorldInfo, NewWorldProps
} from "../lib/world";
import {
  MdMenu,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdClose
} from 'react-icons/md';
import { WorldBlock } from "../lib/block";
import {
  GENES, enabledGenesToPool
} from "../lib/genome";
import Controls from "./Controls";
import RoundButton, { ROUND_BUTTON_ICON_STYLE } from "./RoundButton";
import { observer } from "mobx-react";
import { sidebarStore } from "stores/sidebar";

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


const viewModesList = Object
  .keys(VIEW_MODES)
  .map(key => {
    return {
      value: key,
      title: VIEW_MODES[key]!.name
    };
  });

const Wrapper = styled.div`
  display: flex;
  background-color: black;
  overflow: hidden;
  width: 100%;
`;

const App = observer(() => {
  const [appHeight, setAppHeight] = useState(window.innerHeight);
  const [paused, setPaused] = useState(false);
  const [viewMode, setViewMode] = useState<string>('normal');
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
    setImage(world.toImage(VIEW_MODES[viewMode]!.blockToColor, visualizerParams));
    setWorldInfo(world.getInfo());
    if (!paused) {
      let id = setInterval(() => {
        world.step();
        setImage(world.toImage(VIEW_MODES[viewMode]!.blockToColor, visualizerParams));
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
  }, [viewMode, paused, world, visualizerParams, enabledGenes]);

  return (
    <Wrapper style={{ height: `${appHeight}px` }}>
      {image && <Viewer
        paused={paused}
        sidebarWidth={"300px"}
        viewMode={viewMode}
        image={image}
        world={world}
        setSelectedBlock={setSelectedBlock}
      />}
      <Sidebar
        setViewMode={setViewMode}
        viewModesList={viewModesList}
        viewMode={viewMode}
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
      <Controls>
        <RoundButton title="Настройки" onClick={sidebarStore.toggle}>
          {sidebarStore.isOpen
            ? <MdClose style={ROUND_BUTTON_ICON_STYLE} />
            : <MdMenu style={ROUND_BUTTON_ICON_STYLE} />}
        </RoundButton>
        <RoundButton
          title="Пауза / продолжить"
          onClick={() => setPaused(!paused)}
        >
          {paused
            ? <MdPlayArrow style={ROUND_BUTTON_ICON_STYLE} />
            : <MdPause style={ROUND_BUTTON_ICON_STYLE} />}
        </RoundButton>
        <RoundButton
          title="Шаг симуляции"
          onClick={() => {
            world.step();
            setPaused(true);
            setImage(
              world.toImage(
                VIEW_MODES[viewMode]!.blockToColor,
                visualizerParams
              )
            )
          }}
        >
          <MdSkipNext style={ROUND_BUTTON_ICON_STYLE} />
        </RoundButton>
      </Controls>
    </Wrapper>
  );
});

export default App;