import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import VIEW_MODES, { VisualiserParams } from "../../lib/view-modes";
import Sidebar from "./Sidebar";
import Viewer from "./Viewer";
import {
  SquareWorld,
  World, WorldInfo, NewWorldProps
} from "../../lib/world";
import {
  MdSettings,
  MdPlayArrow,
  MdPause,
  MdSkipNext
} from 'react-icons/md';
import { WorldBlock } from "../../lib/block";
import {
  GENES, enabledGenesToPool
} from "../../lib/genome";
import RoundButtonsGroup from "./RoundButtonsGroup";
import RoundButton, { ROUND_BUTTON_ICON_STYLE } from "./RoundButton";
import { Bot } from "../../lib/bot";

const initialEnabledGenes: { [geneName: string]: boolean } = {};
for (const name in GENES) {
  initialEnabledGenes[name] = GENES[name]!.defaultEnabled;
}

const initialGenePool = enabledGenesToPool(initialEnabledGenes);

const INIT_WORLD_PROPS: NewWorldProps = {
  width: Math.max(Math.floor((window.innerWidth - 300) / 7) - 6, 80),
  height: Math.max(Math.floor(window.innerHeight / 7) - 6, 80),
  botsAmount: 100,
  genePool: initialGenePool
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

console.log(initVisualizerParams.action);


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

type AppProps = {
  sidebar: {
    padding: string,
    width: string
  };
};

const App = (props: AppProps) => {
  const [appHeight, setAppHeight] = useState(window.innerHeight);
  const [sidebarOpened, setSidebarOpened] = useState(true);
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
    console.log('changed');
    console.log(visualizerParams);
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
        'background: #eee; color: #314c4e; font-family: "Cascadia Code"'
      );
      return () => {
        clearInterval(id);
        console.log(
          `%c -| stop loop (id: ${id}) `,
          'background: #eee; color: #314c4e; font-family: "Cascadia Code"'
        );
      };
    }
  }, [viewMode, paused, world, visualizerParams, enabledGenes]);

  return (
    <Wrapper style={{ height: `${appHeight}px` }}>
      {image && <Viewer
        sidebarOpened={sidebarOpened}
        paused={paused}
        sidebarWidth={props.sidebar.width}
        viewMode={viewMode}
        image={image}
        world={world}
        setSelectedBlock={setSelectedBlock}
      />}
      <Sidebar
        opened={sidebarOpened}
        style={props.sidebar}
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
      <RoundButtonsGroup
        sidebarWidth={props.sidebar.width}
        sidebarOpened={sidebarOpened}
      >
        <RoundButton title="Настройки" onClick={() => setSidebarOpened(!sidebarOpened)}>
          <MdSettings style={ROUND_BUTTON_ICON_STYLE} />
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
      </RoundButtonsGroup>
    </Wrapper>
  );
};

export default App;