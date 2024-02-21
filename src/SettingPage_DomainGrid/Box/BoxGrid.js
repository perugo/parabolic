import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';
const MainContentWrapper = styled.div`
`
const Content = styled.div`
flex-direction:column;
display:flex;
`

const Front = styled.div`
border-radius: 5px;
overflow: hidden;
  box-sizing:border-box;
  background-color: rgb(255,255,255);
  border-spacing:0;
  cursor:auto;
  direction 1tr;
  empty-cells:show;
  hyphens:none;
  tab-size:8;
  text-align:left;
  text-indent:0;
  text-transform:none;
  widows:2;
  word-spacing:normal;
  font-weight:400;
  -webkit-font-smoothing:auto;
  word-break:bread-word;
  display:block;
  position:relative;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  &::before{
    content:"";
    position:absolute;
    left:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    border-top: 1px solid #eaeded;
    z-index:1;
  }
  &::after{
    content:"";
    position:absolute;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    box-shadow:0 1px 1px 0 rgba(0,28,36,0,3) 1px 1px 1px 1px 0 rgba(0,28,36,0.15), -1px 1px 1px 0 rgba(0,28,36,0.15);
    mix-blend-mode:multiply;
  }

`



const FrontHeader = styled.div`
  border-bottom:1px solid #eaeded;
`
const FrontHeaderInner = styled.div`
 width:100%;
 background-color: rgb(246,246,246);
 display:flex;
 padding:1px 20px 0px 20px;
 box-sizing:border-box;
 border:none;
 line-height 22px;
 tex-align:left;
 justify-content:space-between;
`
const TitleWrapper = styled.div`
flex-wrap:wrap;
justify-content:space-between;
display:flex;
align-content:center;
font-size:18px;
min-width:0;
color:#16191f;
margin-right:30px;
`
const CustomH3 = styled.span`
 font-size:18px;
 font-weight:500;
 font-family:Arial,sans-serif, Helvetica,Circular;
 -webkit-font-smoothing:auto;
 display:inline;
 margin-right:8px;
 margin:0px;
 color:rgb(40,40,40);
`


const FrontBody = styled.div`
position:relative;
padding-top:16px;
padding:10px 20px 8px 20px;

`
const ColumnLayout = styled.div`
  margin:-10px;
  display:flex;
  flex-wrap:wrap;
  color::#16191f;
  box-sizing:border-box;
  border-collapse:separete;
  direction:1tr;
  flex-direction:column;


  cursor:auto;
  direction:1tr;
  text-align:left;
  font-size:18px;
  line-height:20px;
  color:#16191f;
  font-weight:500;
  font-family:times new roman,serif;
`
const GridColumn = styled.div`
  padding:10px 10px 5px 10px;
  box-sizing:border-box;
  display:flex;
  position:relative;
  flex-direction:column;
`
const ColumnTitle = styled.div`
  font-size:14px;
  font-weight:500;
  line-height:1.2;
  color:rgb(100,100,100);
  margin-bottom:2px;
  font-family:times new roman,serif;
  font-family:"times new roman", serif;
`
//,"Helvetica Neue",Roboto,Arial,sans-serif
const SpanText = styled.span`
font-size:15px;
font-weight:500;
line-height:22px;
color:rgb(40,40,40);
margin-bottom:2px;
`

const Button = styled.button`
background-color:rgb(255,255,255);
border-color:rgb(0,0,0);
border-style:solid;
border-width:1px;
border-radius:2px;
padding:0px 15px;
line-height:1.5;
display:flex;
justify-content:center;
&:hover {
  border-color:rgb(100,100,100);
  background-color:rgb(240,240,240);
}
cursor:pointer;
`
const ContentBodyRow = styled.div`
  margin-bottom:7px;
  position:relative;
  display: inline-block;
  display:flex;
  cursor:pointer;
`
const FrontHeaderLeft = styled.div`
line-height:none;
display:flex;
flex-direction:row;
`
const SliderWrapper = styled.div`
padding:4px 0px 5px 0px;
`
const Label = styled.div`
  margin-left:5px;
  text-align:left;
  font-size:16px;
`
const RadioButton = styled.label`
  font-size: 15px;
  display:flex;
  position:relative;
`

const ButtonSmallWrapper = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
`
const ButtonSmall = styled.div`
  backface-visibility: hidden;
  background-color:rgb(255,153,0);
  border: 0;
  box-sizing: border-box;
  color:rgb(0,0,0);
  cursor: pointer;
  display: inline-block;
  font-family:sans-serif,Arial, Helvetica,Circular,Helvetica,sans-serif;
  font-weight: 500;
  font-size:16px;
  line-height:1.5;
  position: relative;
  text-align: left;
  text-decoration: none;
  letter-spacing:.25px;
  border-radius:4px;
  padding: 0px 17px;
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
export const BoxGrid = ({ setting, setSetting }) => {
  const timeoutIdRef = useRef();
  const [nx, setNx] = useState(0);//rc-sliderが少数点の値を扱えないため、d*100したもの
  const [marks, setMarks] = useState({});
  const [nxMin, setNxMin] = useState(0);
  const [nxMax, setNxMax] = useState(0);
  useEffect(() => {
    if (!checker_SETTING(setting)) return;
    const { nx: inputNx } = setting;
    setNx(inputNx);
    const initialMarks = calculateMarks(setNxMin, setNxMax);
    setMarks(initialMarks);

  }, [setting]);

  useEffect(() => {
    clearTimeout(timeoutIdRef.current);
    startTimer();
  }, [nx])

  const handleSliderChanged = (newValue) => {
    setNx(newValue);
  };

  const handleTimeout = () => {
    setSetting({ ...setting,nx: nx } );
  };

  const startTimer = () => {
    timeoutIdRef.current = setTimeout(handleTimeout, 300);
  };
  return (
    <div>
      <MainContentWrapper>
        <Content>
          <Front>
            <FrontHeader>
              <FrontHeaderInner>
                <FrontHeaderLeft>
                  <TitleWrapper>
                    <CustomH3 style={{ margin: 0 }}>x軸の分解精度</CustomH3>
                  </TitleWrapper>

                </FrontHeaderLeft>
              </FrontHeaderInner>
            </FrontHeader>

            <FrontBody>
              <ColumnLayout>
                <GridColumn>

                  <ColumnTitle style={{ fontFamily: "serif" }}>
                    x軸の分解精度 : {nx}
                  </ColumnTitle>
                  <SliderWrapper>
                    <Slider
                      value={nx}
                      min={nxMin}
                      max={nxMax}
                      step={null}
                      marks={marks}
                      onChange={handleSliderChanged}
                      railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "10px" }}
                      trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "10px" }}
                      handleStyle={{ fontSize: '18px' }}
                    />
                  </SliderWrapper>

                </GridColumn>
              </ColumnLayout>
            </FrontBody>
          </Front>
        </Content>
      </MainContentWrapper>
    </div>
  )
};

const calculateMarks = (setNxMin, setNxMax) => {
  const initialMarks = {};
  let start = 80;
  let end = 500;
  let increment = 20;
  let i;
  for (i = start; i <= end; i = (i + increment)) {
    initialMarks[i] = ' ';
  }
  setNxMin(start);
  setNxMax(end);
  return initialMarks;
};

const settingFields = ['fieldX', 'fieldY', 'nx', 'totalPointsX',
  'focalDistance', 'freq', 'theta'];

function checker_SETTING(set) {
  if (!set) return false;
  if(!settingFields.every(field => typeof set[field] === 'number')) return false;
  return true;
}