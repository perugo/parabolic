import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, RadioButton, OutlinedButtonContainer, OutlinedButtonText,
  RadioButtonInput
} from './StyledBoxComponents';

const ContentBodyRow = styled.div`
  margin-bottom:3px;
  position:relative;
  display:flex;
  cursor:pointer;
  line-height:20px;
  align-items:center;
`

const Label = styled.div`
  margin-left:10px;
  text-align:left;
  font-size:14px;
  margin-top:-2px;
  font-weight: 500;
`
const WaveFormList=styled.div`
  margin-left:-7px;
`
export const BoxWaveform = ({ amplitudeScaler, setAmplitudeScaler, setShowWindow }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (amplitudeScaler.Select === "SineWave") setSelectedIndex(0);
    if (amplitudeScaler.Select === "Pulse") setSelectedIndex(1);
  }, [amplitudeScaler])

  const changeObjectIndex = (index) => {
    if (index === 0) setAmplitudeScaler({ ...amplitudeScaler, Select: "SineWave" });
    if (index === 1) setAmplitudeScaler({ ...amplitudeScaler, Select: "Pulse" });
  }
  const waveformSelection = [
    { name: "正弦波" },
    { name: "変調パルス波" }
  ];
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner style={{ padding: "3px 20px 0px 20px" }}>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3 style={{ margin: 0 }}>波形</CustomH3>
            </TitleWrapper>
            <OutlinedButtonContainer>
              <OutlinedButtonText onClick={() => { setShowWindow("settingInputWave") }}>設定</OutlinedButtonText>
            </OutlinedButtonContainer>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <WaveFormList>
            {waveformSelection.map((waveform, index) => (
              <ContentBodyRow key={index} onClick={() => changeObjectIndex(index)}>
                <RadioButton>
                  <RadioButtonInput
                    type="radio"
                    checked={selectedIndex === index}
                    readOnly
                  />
                </RadioButton>
                <Label>{waveform.name}</Label>
              </ContentBodyRow>
            ))}
            </WaveFormList>

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};
const freeSpaceLambda = (value) => {

}
function checker_SETTING(obj) {
  if (!obj) return false;
  const requiredFields = {
    fieldX: (data) => typeof data === 'number',
    fieldY: (data) => typeof data === 'number',
    split: (data) => typeof data === 'number',
    freq: (data) => typeof data === 'number',
  }
  return Object.keys(requiredFields).every(key => requiredFields[key](obj[key]));
}
function checker_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const settingFields = ['fieldX', 'fieldY', 'split', 'freq'];
  if (fieldsMatch(obj1, obj2, settingFields)) return true;
  return false;
}
function compare_ONLYFREQCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const samesettingFields = ['fieldX', 'fieldY', 'split'];
  if (!fieldsMatch(obj1, obj2, samesettingFields)) return false;
  return obj1.freq !== obj2.freq;
}
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
const calculateMarks = (fieldX, split, setFreqMin, setFreqMax) => {
  const initialMarks = {};
  const minlambdaOverDx = 10;
  const maxlambdaOverDx = 40;
  const numSliderSteps = 20;

  const freqStart = 3e8 / (minlambdaOverDx * fieldX / split);
  let start = roundToFourSignificantFigures(freqStart);
  const freqEnd = 3e8 / (maxlambdaOverDx * fieldX / split);
  let end = roundToFourSignificantFigures(freqEnd);
  const freqIncrement = (freqStart - freqEnd) / numSliderSteps;
  let increment = roundToFourSignificantFigures(freqIncrement);
  let i;
  let index = 0;

  //console.log("start: " + start / 1e9 + "  end: " + end / 1e9 + " increment: " + increment / 1e9);
  for (i = end; i <= start; i = roundToFourSignificantFigures(i + increment)) {
    // 繰り返し処理の中でiを有効数字4桁に丸め、それをキーとして使用
    //console.log("i:" + i / 1e9);
    if (index % 5 === 0) {
      initialMarks[i] = getStrFreq(i, 1);
    } else {
      initialMarks[i] = ' ';
    }
    index += 1;

  }
  setFreqMin(roundToFourSignificantFigures(end));
  setFreqMax(i - increment);

  return initialMarks;
};
function fieldsMatch(obj1, obj2, fields) {
  return fields.every(field => obj1[field] === obj2[field]);
}

const getStrFreq = (freqValue, fixed) => {
  let value; let unit;
  if (freqValue < 1e3) {
    value = freqValue.toFixed(fixed);
    unit = 'Hz';
  } else if (freqValue < 1e6) {
    value = (freqValue * 1e-3).toFixed(fixed);
    unit = 'kHz';
  } else if (freqValue < 1e9) {
    value = (freqValue * 1e-6).toFixed(fixed);
    unit = 'MHz';
  } else if (freqValue < 1e12) {
    value = (freqValue * 1e-9).toFixed(fixed);
    unit = 'GHz';
  } else if (freqValue < 1e15) {
    value = (freqValue * 1e-12).toFixed(fixed);
    unit = 'THz';
  }
  return value + " " + unit;
};
const getStrLambda = (freqValue, fixed) => {

  let value; let unit;
  let lambda = 3e8 / freqValue;

  if (lambda > 1) {
    value = lambda.toFixed(fixed);
    unit = 'm';
  } else if (lambda > 1e-3) {
    value = (lambda * 1e3).toFixed(fixed);
    unit = 'mm';
  } else if (lambda < 1e-6) {
    value = (lambda * 1e6).toFixed(fixed);
    unit = 'um';
  } else if (lambda < 1e9) {
    value = (lambda * 1e-9).toFixed(fixed);
    unit = 'pm';
  } else if (lambda < 1e12) {
    value = (lambda * 1e-12).toFixed(fixed);
    unit = 'fm';
  } else {
    value = lambda.toFixed(fixed);
    unit = 'm';
  }
  return value + " " + unit;
};