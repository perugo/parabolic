import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft,
} from './StyledBoxComponents';


const SliderWrapper = styled.div`
padding:0px;
padding-bottom:2px;
line-height:20px;
cursor:grab;
`
const TextRow = styled.div`
display:flex;
flex-direction:row;
`
const Text = styled.div`
font-size:18px;
margin:0;
padding:0;
line-height:1.1;
`
const meterOptions = [
  { value: 0, label: 'm' },
  { value: 3, label: 'mm' },
  { value: 6, label: 'um' },
  { value: 9, label: 'nm' },
  { value: 12, label: 'pm' },
]
export const BoxFocalDistance = ({ setting, setSetting, padding, setPadding }) => {
  const timeoutIdRef = useRef(null);
  const reserveIdRef = useRef(null);

  const [focalvalue, setFocalValue] = useState(0);
  const [focalMarks, setFocalMarks] = useState({});
  const [focalMax, setFocalMax] = useState(0);
  const [focalvalueMin, setFocalvalueMin] = useState(0);
  const [focalInc, setFocalInc] = useState(0);

  const [dispTFX, setDispTFX] = useState(0);
  const [TFXMarks, setTFXMarks] = useState({});
  const [TFXMax, setTFXMax] = useState(0);
  const [TFXMin, setTFXMin] = useState(0);

  const [antennaYnumPoints, setAntennaYnumPoints] = useState(0);
  const [dispPY, setDispPY] = useState(0);
  const [PYMarks, setPYMarks] = useState({});
  const [PYMin, setPYMin] = useState(3);
  const [PYMax, setPYMax] = useState(0);

  const [dispDx, setDispDx] = useState(0);
  const [meterExponent, setMeterExponent] = useState(0);

  const prevSetting = useRef(null);
  const prevPadding = useRef(null)
  useEffect(() => {

    if (!checker_OK(setting, padding)) return;
    if (checker_NOCHANGE(setting, padding, prevSetting.current, prevPadding.current)) return;
    if (prevSetting.current === null) {
      const { fieldX,nx,totalPointsX: inputTotalPointsX, focalDistance: inputFocalDistance } = setting;

      if(inputTotalPointsX!==0)setDispTFX(inputTotalPointsX);
      setFocalValue(inputFocalDistance);

      const paddingmarks = makePYMarks(setting, padding,meterExponent,dispDx, setDispPY, setPYMin, setPYMax, setAntennaYnumPoints);
      setPYMarks(paddingmarks);

      const dx = fieldX / nx;
      setDispDx(dx);
      setMeterExponent(initMeterExponent(fieldX));
    }
    console.log("FocalBox EveryThing");
    const focalmarks = makeFocalMarks(setting, padding, setFocalvalueMin, setFocalInc, setFocalMax);
    setFocalMarks(focalmarks);


    const tfxmarks = makeTFXMarks(setting, padding, dispTFX, setDispTFX, setTFXMin, setTFXMax);
    setTFXMarks(tfxmarks);

    const { totalPointsX: inputTotalPointsX, focalDistance: inputFocalDistance } = setting;
    if (inputTotalPointsX !== 0) setDispTFX(inputTotalPointsX);
    setFocalValue(inputFocalDistance);


    if (setting.totalPointsX === 0) return;
    prevSetting.current = setting;
    prevPadding.current = padding;

  }, [setting, padding])
  useEffect(() => {
    if (reserveIdRef.current) {
      clearTimeout(reserveIdRef.current);
    }
    reserveIdRef.current = setTimeout(() => {
      if (focalvalueMin === 0) {
      } else {
        setSetting({ ...setting, totalPointsX: dispTFX, focalDistance: focalvalue });
        setPadding({ ...padding, YAntenna: (PYMax + 0 - dispPY) });
      }
      reserveIdRef.current = null;
    }, 600);

    if (timeoutIdRef.current) return;
    if (focalvalueMin === 0) {
    } else {
      setSetting({ ...setting, totalPointsX: dispTFX, focalDistance: focalvalue });
      setPadding({ ...padding, YAntenna: (PYMax + 0 - dispPY) });
    }
    timeoutIdRef.current = setTimeout(() => {
      timeoutIdRef.current = null;
    }, 200);

    return () => {
      if (reserveIdRef.current) {
        clearTimeout(reserveIdRef.current)
      }
    };
  }, [dispTFX, focalvalue, dispPY]);

  const handleTFXSliderChanged = (newValue) => {
    setDispTFX(newValue)
  }
  const handleFocalSliderChanged = (newValue) => {
    setFocalValue(focalvalueMin + newValue * focalInc);
  }
  const handlePYSliderChanged = (newValue) => {
    setDispPY(newValue);
  }

  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>パラボラアンテナ</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <TextRow>
              <Text style={{ fontSize: "14px", padding: "3px 7px 0px 0px" }}>直径  {roundToThreeSignificantFigures(Math.pow(10, meterExponent) * dispDx * (antennaYnumPoints - 2 * (PYMax + 3 - dispPY)))} {dispMeterUnit(meterExponent)} </Text>
              <Text style={{ fontSize: "14px", padding: "3px 7px 0px 15px" }}> (  開口直径の格子数: {antennaYnumPoints - 2 * (PYMax + 3 - dispPY)} )</Text>
            </TextRow>
            <SliderWrapper>
              <Slider
                value={dispPY}
                min={PYMin}
                max={PYMax}
                marks={PYMarks}
                onChange={handlePYSliderChanged}
                railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "8px" }}
                trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "8px" }}
                handleStyle={{ fontSize: '18px' }}
              />
            </SliderWrapper>

            <TextRow>
              <Text style={{ fontSize: "14px", padding: "3px 7px 0px 0px" }}>焦点距離: {roundToThreeSignificantFigures(Math.pow(10, meterExponent) * focalvalue).toString()}  {dispMeterUnit(meterExponent)}</Text>
            </TextRow>
            <SliderWrapper>
              <Slider
                value={(focalvalue - focalvalueMin) / (+focalInc)}
                min={0}
                max={focalMax}
                marks={focalMarks}
                onChange={handleFocalSliderChanged}
                railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "8px" }}
                trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "8px" }}
                handleStyle={{ fontSize: '18px' }}
              />
            </SliderWrapper>
            <TextRow>
              <Text style={{ fontSize: "14px", padding: "3px 7px 0px 0px" }}>Total Fieldのx軸格子数 (y軸固定): {dispTFX} </Text>
            </TextRow>
            <SliderWrapper>
              <Slider
                value={dispTFX}
                min={TFXMin}
                max={TFXMax}
                marks={TFXMarks}
                onChange={handleTFXSliderChanged}
                railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "8px" }}
                trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "8px" }}
                handleStyle={{ fontSize: '18px' }}
              />
            </SliderWrapper>

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};

const settingFields = ['fieldX', 'fieldY', 'nx', 'totalPointsX',
  'focalDistance', 'freq', 'theta'];
const paddingFields = ['TF', 'XRightAntenna', 'XLeftAntenna', 'YAntenna'];

const dispMeterUnit = (value) => {
  const matchedOptions = meterOptions.find(option => option.value === value);
  return matchedOptions ? matchedOptions.label : "";
}
function checker_OK(setting, padding) {
  if (!setting || !padding) return false;
  if (!settingFields.every(field => typeof setting[field] === 'number')) return false;
  if (!paddingFields.every(field => typeof padding[field] === 'number')) return false;
  return true;

}
function checker_NOCHANGE(setting1, padding1, setting2, padding2) {
  if (!setting1 || !padding1 || !setting2 || !padding2) return false;
  if (!fieldsMatch(setting1, setting2, settingFields)) return false;
  if (!fieldsMatch(padding1, padding2, paddingFields)) return false;

  return true;
}
const makeTFXMarks = (setting, padding, dispTFX, setDispTFX, setTFXMin, setTFXMax) => {
  const { fieldX, fieldY, nx, focalDistance, totalPointsX, freq, theta } = setting;
  const { TF, XRightAntenna, XLeftAntenna, YAntenna } = padding;
  const dx = fieldX / nx;
  const ynum = Math.ceil(fieldY / dx);
  const MINIMUPADDING_YANTENNA = YAntenna;

  const AntennaYnumPoints = ynum - 2 * TF - 2 * MINIMUPADDING_YANTENNA;
  const a = 1 / (4 * focalDistance);
  const initialMarks = {};

  const xTFNumMin = Math.ceil((a * (dx * (AntennaYnumPoints / 2)) * (dx * (AntennaYnumPoints / 2))) / dx) + XRightAntenna + XLeftAntenna;
  const xTFNumMax = nx - 2 * TF;
  setTFXMin(xTFNumMin);
  setTFXMax(xTFNumMax);

  let i = xTFNumMin;
  //initialMarks[i] = (i).toString();

  for (; i <= xTFNumMax; i += 1) {
    if (i % 50 === 0) {
      initialMarks[i] = (i).toString();
    }
  }
  initialMarks[i - 1] = (i - 1).toString();

  if (dispTFX < xTFNumMin) {
    setDispTFX(xTFNumMin);
  }
  return initialMarks;
}
const makeFocalMarks = (setting, padding, setFocalvalueMin, setFocalInc, setFocalMax) => {
  const { fieldX, fieldY, nx, focalDistance, totalPointsX, freq, theta } = setting;
  const { TF, XRightAntenna, XLeftAntenna, YAntenna } = padding;
  const dx = fieldX / nx;
  const meterE = Math.pow(10, initMeterExponent(fieldX));
  const ynum = Math.ceil(fieldY / dx);
  const MINIMUPADDING_YANTENNA = YAntenna;
  const AntennaYnumPoints = ynum - 2 * TF - 2 * MINIMUPADDING_YANTENNA;
  const edge = AntennaYnumPoints / 2;
  let focalmin = 0.5 * dx * edge;
  setFocalvalueMin(focalmin);
  let focalmax = (nx - 2 * TF) * dx;

  const FOCALMAX = 8;
  const insident = (focalmax - focalmin) / FOCALMAX;
  let passInsident = 1 * insident;
  const SLIDERNUM = 90;
  let inc = ((focalmax - focalmin) / SLIDERNUM);

  setFocalInc(inc);
  let initialMarks = {};

  let i = 0;
  initialMarks[i] = (roundToThreeSignificantFigures(focalmin * meterE)).toString();
  for (i = 1; i <= SLIDERNUM; i++) {
    if ((i * inc) >= passInsident) {
      initialMarks[i] = (roundToThreeSignificantFigures(meterE * (i * inc + focalmin))).toString();
      passInsident += insident;
    }
  }
  initialMarks[i - 1] = (roundToThreeSignificantFigures(meterE * ((i - 1) * inc + focalmin))).toString();

  setFocalMax(SLIDERNUM);
  return initialMarks;
}

const makePYMarks = (setting, padding,meterExponent,dispDx, setDispPY, setPYMin, setPYMax, setAntennaYnumPoints) => {
  const { fieldX: inputFieldX, fieldY: inputFieldY, nx: inputXnum,
    focalDistance: inputFocalDistance, totalPointsX: inputTotalPointsX, freq: inputFreq, theta: inputTheta } = setting;
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = padding;

  const ynum = Math.ceil(inputFieldY / (inputFieldX / inputXnum));
  const AntennaYnumPoints = ynum - 2 * paddingTF;
  setAntennaYnumPoints(AntennaYnumPoints);
  const minimalAntennaYnum = 40;
  const MINIMUPADDING_YANTENNA = 3;

  const paddingMax = Math.ceil((AntennaYnumPoints - minimalAntennaYnum) / 2);
  setDispPY(paddingMax);

  //setPYMin(MINIMUPADDING_YANTENNA);
  let initialMarks = {};

  for (let i = paddingMax; i >= MINIMUPADDING_YANTENNA; i--) {
    //console.log(paddingMax-i);
    const place = AntennaYnumPoints - i * 2;

            
    if (place % 20 === 0 || place % 20 === 1) {
      initialMarks[paddingMax - i + MINIMUPADDING_YANTENNA] = (roundToThreeSignificantFigures(Math.pow(10, meterExponent) * dispDx * place)).toString();
    } else {
      initialMarks[paddingMax - i + MINIMUPADDING_YANTENNA] = ('').toString();
    }
  }
  //initialMarks[i + 1] = (AntennaYnumPoints - (i + 1) * 2).toString();
  setPYMax(paddingMax);
  setPYMin(MINIMUPADDING_YANTENNA);
  return initialMarks;
}

function fieldsMatch(obj1, obj2, fields) {
  return fields.every(field => obj1[field] === obj2[field]);
}
function roundToTwoSignificantFigures(num) {
  if (num === 0) {
    return 0; // 0は特別に扱う
  }
  let d = Math.ceil(Math.log10(num < 0 ? -num : num)); // 数の大きさの桁数を求める
  let power = 2 - d; // 4桁の有効数字になるように桁を調整
  let magnitude = Math.pow(10, power);
  let shifted = Math.round(num * magnitude);
  return shifted / magnitude;
}
function roundToThreeSignificantFigures(num) {
  if (num === 0) {
    return 0; // 0は特別に扱う
  }
  let d = Math.ceil(Math.log10(num < 0 ? -num : num)); // 数の大きさの桁数を求める
  let power = 3 - d; // 4桁の有効数字になるように桁を調整
  let magnitude = Math.pow(10, power);
  let shifted = Math.round(num * magnitude);
  return shifted / magnitude;
}

const initMeterExponent = (metervalue) => {
  if (metervalue > 1) {
    return 0;
  } else if (metervalue > 1e-3) {
    return 3;
  } else if (metervalue > 1e-6) {
    return 6;
  } else if (metervalue > 1e-9) {
    return 9;
  } else if (metervalue > 1e-12) {
    return 12;
  } else { return 0; }
}



function RoundCustom(number) {
  // 数値を文字列に変換し、整数部と小数部に分割
  var parts = number.toString().split('.');
  var integerDigits = parts[0].length;
  var decimalDigits = 0;

  // 小数部がある場合、有効な小数桁数をカウント
  if (parts.length > 1) {
    var decimalPart = parts[1];
    for (var i = 0; i < decimalPart.length; i++) {
      decimalDigits++;
      if (decimalPart[i] !== '0') {
        break;
      }
    }
  }
  // 精度を設定
  var precision;
  if (decimalDigits > 0) { // 小数部がある場合
    precision = decimalDigits - integerDigits + 4; // 整数部と小数部の合計桁数から4を引く
  } else { // 整数部のみの場合
    return Number(number);
  }

  // 精度が負にならないように調整
  precision = Math.max(precision, 0);

  // 割り算の結果を計算して丸める
  return Number(number.toFixed(precision));

}