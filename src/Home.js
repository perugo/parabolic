import styled from "styled-components";
import { useState, useEffect, useRef } from 'react';

import { DrawCanvas } from './Components_Home/DrawCanvas';
import { SimulationCanvas } from './Components_Home/SimulationCanvas';
import { Link } from './Link';
import { RightBar } from './Components_Home/RightBar';
import { DEFAULT, BREAD } from './constants';
import { maker_RECT, updateLinkBread } from './helpers';
import { Home as SettingInputWave } from './SettingPage_InputWave/Home';
import { Home as SettingDomainGrid } from './SettingPage_DomainGrid/Home';
const Container = styled.div`
  margin-left:10px;
  position:relative;
  display:flex;
  flex-direction:column;
`
const Body = styled.div`
  position:relative;
`
const ContainerHome = styled.div`
  position:relative;
  display: inline-block;
  display:flex;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
  flex-direction:row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`
const Wrapper = styled.div`
  position: absolute;
  width:100%; height:100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
`;
const LeftBar = styled.div`
  position:relative;
`
export const Home = () => {
  const { SETTING, PADDING, AMPLITUDESCALER, COLOR } = DEFAULT;
  const [setting, setSetting] = useState(SETTING);
  const [padding, setPadding] = useState(PADDING);
  const [amplitudeScaler, setAmplitudeScaler] = useState(AMPLITUDESCALER);
  const [color, setColor] = useState(COLOR);

  const [drawData, setDrawData] = useState({});
  const [showSimulation, setShowSimulation] = useState(false);
  const [moveVideo, setMoveVideo] = useState(false);

  const [rectDrawData, setRectDrawData] = useState({ width: 0, height: 0 });
  const [LinkBread, setLinkBread] = useState([]);

  const [simulationData, setSimulationData] = useState({});
  const [showWindow, setShowWindow] = useState("home");

  useEffect(() => {
    setDrawData({ setting: setting, padding: padding });
    setShowSimulation(false);
  }, [setting, padding])
  useEffect(() => {
    setRectDrawData(maker_RECT(SETTING));
  }, [])
  useEffect(() => {
    updateLinkBread(showWindow, BREAD, setLinkBread);
  }, [showWindow]);
  useEffect(() => {
    setRectDrawData(maker_RECT(SETTING));
  }, [])
  useEffect(() => {
    setShowSimulation(false);
  }, [color, amplitudeScaler])
  const push = () => {
    const obj = {
      setting: setting,
      padding: padding,
      color: color,
      amplitudeScaler: amplitudeScaler
    }
    setShowSimulation(true);
    setSimulationData(obj);
  }
  const reset = () => {
    setRectDrawData(maker_RECT(SETTING));
    setSetting(SETTING);
    setPadding(PADDING);
    setAmplitudeScaler(AMPLITUDESCALER);
    setColor(COLOR);
    setDrawData({ ...drawData });
  }

  const drawCanvasProps = {
    drawData,
    setSetting,
    rect: rectDrawData
  }
  const simulationCanvasProps = {
    simulationData,
    showSimulation, setShowSimulation,
    moveVideo, setMoveVideo,
    rect: rectDrawData
  };
  const rightBarProps = {
    setting, setSetting,
    padding, setPadding,
    amplitudeScaler, setAmplitudeScaler,
    setShowWindow,
    showSimulation, setShowSimulation,
    moveVideo, setMoveVideo,
    color, setColor
  };
  const settingInputWaveProps = {
    setting,
    amplitudeScaler, setAmplitudeScaler,
    setShowWindow
  }
  const settingDomainGridProps = {
    drawData, setDrawData,
    setShowWindow,
    setHomeRectDrawData : setRectDrawData,
    setSetting,
    setPadding,
    defaultPadding:PADDING
  }
  const componentMap = {
    settingInputWave: <SettingInputWave {...settingInputWaveProps} />,
    settingDomainGrid: <SettingDomainGrid {...settingDomainGridProps} />
  };
  return (
    <Container>

      <Link setShowWindow={setShowWindow} linkobject={LinkBread} />
      <Body>
        <ContainerHome $show={showWindow === "home"}>
          <LeftBar style={{ width: rectDrawData.width + "px", height: rectDrawData.height + "px" }}>
            <Wrapper $show={!showSimulation}>
              <DrawCanvas {...drawCanvasProps} />
            </Wrapper>
            <Wrapper $show={showSimulation}>
              <SimulationCanvas {...simulationCanvasProps} />
            </Wrapper>
          </LeftBar>
          <RightBar {...rightBarProps} push={push} reset={reset} />

        </ContainerHome>
        <Wrapper $show={showWindow !== "home"}>
          {componentMap[showWindow]}
        </Wrapper>
      </Body>
    </Container>
  )
};
/*


*/