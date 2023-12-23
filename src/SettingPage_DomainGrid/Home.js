import styled from "styled-components";
import { useRef, useState, useEffect } from 'react';
import { React } from 'react';
import { DrawCanvas } from "./DrawCanvas";
import { BoxGrid } from './Box/BoxGrid';
import { BoxDomain } from './Box/BoxDomain';
const Container = styled.div`
  position:relative;
  display: inline-block;
  display:flex;
`
const LeftSide = styled.div`
  min-width:500px;
`
const WidthSetter = styled.div`
`
const Wrapper = styled.div`
position: relative;
width:100%; height:100%;
top: 0;
left: 0;
display: flex;
flex-direction: column;
`
const ArrowRow = styled.div`
  width:auto;
  margin:5px 0px;
  display:flex;
  position:relative;
  justify-content:center;
  align-items:center;
`
const SVG_Wrapper = styled.div`
  height: 30px;
  width: 38px;
  margin-top: 0px;
  margin-bottom: 0px;
  display: flex;
`;
const SVG_Inner = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  margin: auto;
`;
const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2; // Ensure the image is always on top
`;

const SettingWrapper = styled.div`
  position:relative;
  flex-grow:1;
  min-width:520px;
  height:calc(100vh - 50px);
  display:flex;
  flex-direction:column;
  background-color:rgb(240,240,240);
  user-select: none;  /* 全てのブラウザでテキスト選択を無効にする */
  -webkit-user-select: none;  /* Safari 用 */
  -moz-user-select: none;  /* Firefox 用 */
  -ms-user-select: none;  /* Internet Explorer/Edge 用 */

`
const ToggleWrapper = styled.div`
  width:100%;
  flex-grow:1;
  overflow-y: scroll; // Always show vertical scrollbar
  max-height:100%;
  display: flex;  /* flex container */
  flex-direction: column;  /* column layout */

  /* Styling for the scrollbar */
  &::-webkit-scrollbar {
    width: 10px;  // Width of the scrollbar. Adjust as needed.
  }

  &::-webkit-scrollbar-track {
    background: rgb(230,230,230);  // Background of the track (part scrollbar moves in)
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(170,170,170);  // Color of the actual scrollbar
    border-radius: 4px;  // Optional: Makes the scrollbar rounded
    border: 2px solid transparent; // Prevents border from being offset on macOS browsers
    background-clip: padding-box;  // Makes the background color opaque (not transparent)
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(130,130,130);  // Darken scrollbar when hovered
  }
`
const ToggleInner = styled.div`
  width:100%;
  height:100%;
  background-color:rgb(240,240,240);
  display:flex;
  flex-direction:column;
  align-items: stretch;  /* 子要素を親の幅にストレッチさせる */
  `
const BoxWrapper = styled.div`
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:10px 10px 0px 10px;
`
const ButtonReturnWrapper = styled.div`
  text-align: center;
  padding-top:14px;
  align-items: center;
`
const ButtonReturn = styled.div`
  backface-visibility: hidden;
  background-color:rgb(255,153,0);
  border: 0;
  box-sizing: border-box;
  color:rgb(0,0,0);
  cursor: pointer;
  display: inline-block;
  font-family:sans-serif,Arial, Helvetica,Circular,Helvetica,sans-serif;
  font-weight: 500;
  font-size:18px;
  line-height:1.9;
  position: relative;
  text-align: left;
  text-decoration: none;
  letter-spacing:.25px;
  border-radius:4px;
  padding: 0px 22px;
  transition: transform .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover{
    background-color:rgb(236,114,17);
  }
  &:active{
    background-color:#EB5F07;
}
`
const JustFlexRow = styled.div`
display:flex;
flex-direction:row;
gap:40px;
align-items:center;
justify-content:center;
`
export const Home = ({ drawData, setShowWindow, setHomeRectDrawData, setSetting,setPadding,defaultPadding }) => {
  const [rectDrawData, setRectDrawData] = useState({ width: 0, height: 0 });
  const [rectDraftDrawData, setRectDraftDrawData] = useState({ width: 0, height: 0 });
  const [draftDrawData, setDraftDrawData] = useState({});

  useEffect(() => {
    if (!checker_DRAWDATA(drawData)) return;
    setRectDrawData(maker_RECT(drawData.setting));
    setRectDraftDrawData(maker_RECT(drawData.setting));
    setDraftDrawData(drawData);
  }, [drawData])

  const gridBoxProps = {
    draftDrawData, setDraftDrawData,
  }
  const domainBoxProps = {
    draftDrawData, setDraftDrawData,
  }
  useEffect(() => {
    if (!checker_DRAWDATA(draftDrawData)) return;
    setRectDraftDrawData(maker_RECT(draftDrawData.setting));
  }, [draftDrawData])
  const save = () => {
    setDraftDrawData((currentDraft) => {
      setHomeRectDrawData(maker_RECTForHOME(currentDraft.setting));
      setSetting({...currentDraft.setting,totalPointsX:0,focalDistance:currentDraft.setting.fieldX/2});
    });
    setPadding(defaultPadding);

    setShowWindow("home");
  }
  const ArrowRowComponent =
    <ArrowRow style={{ width: rectDrawData.width }}>
      <SVG_Wrapper >
        <SVG_Inner>
          <StyledImg
            src={`${process.env.PUBLIC_URL}/doubleArrow.svg`}
            alt="Double Arrow Icon"
          />
        </SVG_Inner>
      </SVG_Wrapper>
    </ArrowRow>

  return (
    <Container>
      <LeftSide>
        {rectDrawData && rectDrawData.width !== 0 && rectDraftDrawData && rectDraftDrawData.width !== 0 && (
          <WidthSetter>
            <Wrapper style={{ width: rectDrawData.width, height: rectDrawData.height }}>
              <DrawCanvas drawData={drawData} originalDrawData={drawData}></DrawCanvas>
            </Wrapper>
            {ArrowRowComponent}
            <Wrapper style={{ width: rectDraftDrawData.width, height: rectDraftDrawData.height }}>
              <DrawCanvas drawData={draftDrawData} originalDrawData={drawData}></DrawCanvas>
            </Wrapper>
          </WidthSetter>
        )}
      </LeftSide>
      <SettingWrapper>
        <ToggleWrapper>
          <ToggleInner>
            <BoxWrapper>
              <BoxGrid {...gridBoxProps} />
              <BoxDomain {...domainBoxProps} />
              <JustFlexRow>
                <ButtonReturnWrapper>
                  <ButtonReturn onClick={() => save()}>保存</ButtonReturn>
                </ButtonReturnWrapper>
                <ButtonReturnWrapper>
                  <ButtonReturn onClick={() => setShowWindow("home")}>戻る</ButtonReturn>
                </ButtonReturnWrapper>
              </JustFlexRow>
            </BoxWrapper>
          </ToggleInner>
        </ToggleWrapper>
      </SettingWrapper>
    </Container>
  )
};
export function maker_RECT(setting) {
  const {nx, fieldY, fieldX } = setting;
  const xnum = nx;
  const ynum = Math.ceil(fieldY / (fieldX / xnum));

  const availableHeight = window.innerHeight / 2 - 45;
  const availableWidth = window.innerWidth - 600;

  // Calculate the maximum canvasDx that satisfies both conditions
  const maxCanvasDxHeight = availableHeight / ynum;
  const maxCanvasDxWidth = availableWidth / xnum;
  const canvasDx = Math.min(maxCanvasDxHeight, maxCanvasDxWidth);

  const RECT = {
    width: canvasDx * xnum,
    height: canvasDx * ynum,
  };

  return RECT;
}

const settingFields = ['fieldX', 'fieldY', 'nx', 'totalPointsX',
  'focalDistance', 'freq', 'theta'];
const paddingFields = ['TF', 'XRightAntenna', 'XLeftAntenna', 'YAntenna'];

export function checker_DRAWDATA(obj1) {
  if (!obj1) return false;

  const requiredFields = {
    setting: (data) => {
      if (!data) return false;
      return settingFields.every(field => typeof data[field] === 'number');
    },
    padding: (data) => {
      if (!data) return false;
      return paddingFields.every(field => typeof data[field] === 'number');
    },
  }
  return Object.keys(requiredFields).every(key =>
    requiredFields[key](obj1[key])
  );
}

export function maker_RECTForHOME(set) {
  console.log("setting is");
  console.log(set)
  const {nx, fieldY, fieldX } = set;
  const xnum = nx;
  const ynum = Math.ceil(fieldY / (fieldX / xnum));

  const availableHeight = window.innerHeight - 45;
  const availableWidth = window.innerWidth - 600;

  // Calculate the maximum canvasDx that satisfies both conditions
  const maxCanvasDxHeight = availableHeight / ynum;
  const maxCanvasDxWidth = availableWidth / xnum;
  const canvasDx = Math.min(maxCanvasDxHeight, maxCanvasDxWidth);

  const RECT = {
    width: canvasDx * xnum,
    height: canvasDx * ynum,
  };

  return RECT;
}