import styled from "styled-components";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { validateInput, checker_amplitudeScaler, handleKeyDown, setToDefault, updateStringStates, isStateComplete, isValidNumber } from './BoxSetting_helper';

import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft
} from './StyledBoxComponents';

const ColumnTitle = styled.div`
  font-size:16px;
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
const ButtonWrapperRight = styled.div`
display: flex;
`
const Button = styled.button`
background-color:rgb(255,255,255);
border-color:rgb(0,0,0);
border-style:solid;
border-width:1px;
border-radius:3px;
padding:0px 15px;
line-height:1.5;
display:flex;
justify-content:center;
&:hover {
  border-color:rgb(100,100,100);
  background-color:rgb(240,240,240);
}
&:active{
  background-color:rgb(225,225,225);
}
cursor:pointer;
`
const ContentBodyColumn = styled.div`
  margin-bottom:7px;
  position:relative;
  display: inline-block;
  display:flex;
  flex-direction:column;
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
  line-height:1.3;
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
const ButtonReturnWrapper = styled.div`
  text-align: center;
  display: flex;
  padding-top:14px;
  align-items: center;
  margin:auto;
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
const InputText = styled.input`
width:120px;
  text-align: right;
  box-sizing: border-box;
  font-size: 15px;
  padding: 4px;
  border: 1px solid #ccc;
`
const InputItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
`
const JustFlexRow = styled.div`
display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
`
const SmallLabel = styled.div`
  width: 240px;
  font-size:14px;
  text-align:left;
`;
const WaveFormLabel = styled.div`
width: 240px;
font-size:15px;
text-align:left;
`
const SectionContainer = styled.div`
  margin-left:-8px;
  background-color: #f9f9f9; // A subtle background color to differentiate the section
  padding: 3px 5px 8px 0px;
  border-radius: 5px;
  margin-bottom: 7px; // Space between sections
`;
export const BoxSetting = ({
  amplitudeScaler, setAmplitudeScaler,
  setShowWindow }) => {
  const [strAmplitudeScaler, setStrAmplitudeScaler] = useState({});
  const timeoutIdRef = useRef();
  const [inputFields, setInputFields] = useState([]);
  useEffect(() => {
    if (amplitudeScaler.Select === undefined) return;
    updateStringStates(amplitudeScaler, setStrAmplitudeScaler);
    if (amplitudeScaler.Select == 'SineWave') {
      setInputFields(inputFields1);
    } else {
      setInputFields(inputFields2);
    }
  }, [amplitudeScaler])

  const handleInputChange = (type, field) => (e) => {
    const value = e.target.value;

    if (!validateInput(type, value)) return;
    clearTimeout(timeoutIdRef.current);

    setStrAmplitudeScaler((prevState) => ({
      ...prevState,
      [field]: value
    }));

    startSetInputTimer();
  };


  const startSetInputTimer = () => {
    timeoutIdRef.current = setTimeout(handleSetInputTimeout, 1600);
  };
  const handleSetInputTimeout = () => {
    setStrAmplitudeScaler((current) => {
      let updated = {
        simulationNum: isValidNumber(current.simulationNum) ? parseInt(current.simulationNum) : amplitudeScaler.simulationNum,
        Select: amplitudeScaler.Select,
        SineWave: {
          slope: isValidNumber(current.slope) ? roundToFourSignificantFigures(current.slope) : amplitudeScaler.SineWave.slope,
          shift: isValidNumber(current.shift) ? roundToFourSignificantFigures(current.shift) : amplitudeScaler.SineWave.shift
        },
        Pulse: {
          peakPosition: isValidNumber(current.peakPosition) ? roundToFourSignificantFigures(current.peakPosition) : amplitudeScaler.Pulse.peakPosition,
          widthFactor: isValidNumber(current.widthFactor) ? roundToFourSignificantFigures(current.widthFactor) : amplitudeScaler.Pulse.widthFactor
        }
      }
      setAmplitudeScaler(updated); // ここで新しい状態をセット
    });

  };

  const inputFields1 = [
    { name: "シミュレーション回数の上限 : ", field: 'simulationNum', type: 'integer' },
    { name: "正弦波の設定", field: 'text' },
    { name: "slope : ", field: 'slope', type: 'signedDecimal' },
    { name: "shift : ", field: 'shift', type: 'decimal' },
  ];
  const inputFields2 = [
    { name: "シミュレーション回数の上限 : ", field: 'simulationNum', type: 'integer' },
    { name: "変調パルス波の設定", field: 'text' },
    { name: "peak position : ", field: 'peakPosition', type: 'decimal' },
    { name: "width factor : ", field: 'widthFactor', type: 'decimal' } // lambda is handled separately
  ];
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner style={{padding:"4px 20px 3px 20px"}}>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>波形</CustomH3>
            </TitleWrapper>

          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <InputItemGrid>
            </InputItemGrid>
            {strAmplitudeScaler !== undefined && strAmplitudeScaler.slope !== undefined && (
              <InputItemGrid>
                {inputFields.map(({ name, field, type }, index) => {
                  if (field === 'text') {
                    return (
                      <SectionContainer key={`${field}-${index}`}>
                        <WaveFormLabel style={{ textAlign: "left", marginTop: "8px", marginLeft: "8px" }}>{name}</WaveFormLabel>
                      </SectionContainer>
                    );
                  }
                  return (
                    <JustFlexRow key={field}>
                      <SmallLabel>{name}</SmallLabel>
                      <InputText
                        key={field}
                        maxLength="12"
                        type="text"
                        value={strAmplitudeScaler[field]}
                        onChange={handleInputChange(type, field)}
                        onKeyDown={handleKeyDown(type)}
                      />
                    </JustFlexRow>
                  );

                })}
              </InputItemGrid>
            )}

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};
function roundToFourSignificantFigures(num) {
  if (num === 0) {
    return 0; // 0は特別に扱う
  }
  let d = Math.ceil(Math.log10(num < 0 ? -num : num)); // 数の大きさの桁数を求める
  let power = 4 - d; // 4桁の有効数字になるように桁を調整
  let magnitude = Math.pow(10, power);
  let shifted = Math.round(num * magnitude);
  return shifted / magnitude;
}
