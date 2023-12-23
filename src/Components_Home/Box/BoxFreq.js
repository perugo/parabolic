import styled from "styled-components";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { validateInput, handleKeyDown, isValidNumber } from './BoxFreq_helper';
import Select from 'react-select'
import './../../Components/reactSelect.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft,customStyles
} from './StyledBoxComponents';
const InputText = styled.input`
  width:120px;
  text-align: right;
  box-sizing: border-box;
  font-size: 14px;
  padding: 3px;
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
  font-size:13px;
  text-align:left;
  margin-right:8px;
  line-height:1.1;
`;
const FreeSpaceTextWrapper = styled.div`

  align-items:center;
  height:100%;
  display:flex;
  flex-direction:row;
  font-size:13px;
`
//  align-item:center;
const FreeSpaceText = styled.div`
justify-content:center;
font-size:13px;
margin-left:0px;
line-height:1.1;

`
const ContentBodyRow = styled.div`
  margin-bottom:3px;
  position:relative;
  display:flex;
  cursor:pointer;

`
const EmptyMediumColorIcon = styled.div`
  width:1px;
  height:20px;
  margin:2px 3px 1px 3px;
`
const LabelCell = styled.div`
  height: 100%;
  position:relative;
  -webkit-box-align: center;
  margin-right:0px;
  align-items: center; /* This is for vertical centering when the parent is a flex container */
`
const LabelRow = styled.div`
display:flex;
flex-direction:row;
width:100%;
`
const Mantissa = styled.span`
  font-size: 16px;
`
const MantissaWrapper = styled.div`
  display:flex;
  flex-direction:column-reverse;
`
const Exponent = styled.sup`
  font-size: 12px;
  vertical-align: super;
  margin-top:2px;
`;
const Exponential = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  vertical-align:bottom;
  height:100%;
  width:100%;
`

export const BoxFreq = ({
  setting, setSetting }) => {
  const options = [
    { value: 0, label: 'Hz' },
    { value: -3, label: 'kHz' },
    { value: -6, label: 'MHz' },
    { value: -9, label: 'GHz' },
    { value: -12, label: 'THz' }
  ]
  const meterOptions = [
    { value: 0, label: 'm' },
    { value: 3, label: 'mm' },
    { value: 6, label: 'um' },
    { value: 9, label: 'nm' },
    { value: 12, label: 'pm' },
  ]
  const [strFreqExponent, setStrFreqExponent] = useState('');
  const [strMeterExponent, setStrMeterExponent] = useState('');
  const [HzExponent, setHzExponent] = useState(0);
  const [meterExponent, setMeterExponent] = useState(0);
  const timeoutIdRef = useRef();
  const [freeSpaceExponent, setFreeSpaceExponent] = useState({ mantissa: "", exponent: "" });
  const readOnce = useRef(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [selectedMeterOption, setSelectedMeterOption] = useState(meterOptions[0]);
  const [lambdaperDx,setLambdaperDx]=useState(0);
  useEffect(() => {
    if (setting.freq === undefined) return;
    if (!readOnce.current) {
      const optionExponent = initFreqExponent(setting.freq);
      const selectedOption = options.find(option => option.value === optionExponent);
      setHzExponent(optionExponent);
      setSelectedOption(selectedOption);


      const meteroptionExponent = initMeterExponent(3 * 1e8 / setting.freq);
      const selectedMeterO = meterOptions.find(option => option.value === meteroptionExponent);
      setMeterExponent(meteroptionExponent);
      setSelectedMeterOption(selectedMeterO);
    } else {
      const {nx,fieldX,freq}=setting;
      let dx = fieldX / nx;
      setLambdaperDx(roundToThreeSignificantFigures(3e8/freq/dx));
      const Freqvalue = RoundCustom(freq * Math.pow(10, HzExponent));
      setStrFreqExponent(Freqvalue);
      const Metervalue = RoundCustom(3 * 1e8 / freq * Math.pow(10, meterExponent));
      setStrMeterExponent(Metervalue);
      const value = parseFloat(freq) * Math.pow(10, meterExponent);
      setFreeSpaceExponent(convertToExponential(value));
    }
    readOnce.current = true;
  }, [setting, HzExponent, meterExponent])

  const handleInputChange = () => (e) => {
    const value = e.target.value;

    if (!validateInput(value)) return;
    clearTimeout(timeoutIdRef.current);
    setStrFreqExponent(value);

    startSetInputTimer();
  };


  const startSetInputTimer = () => {
    timeoutIdRef.current = setTimeout(handleSetInputTimeout, 1600);
  };
  const handleSetInputTimeout = () => {
    setStrFreqExponent((currentStrFreq) => {
      console.log(isValidNumber(currentStrFreq));
      let newFreq = isValidNumber(currentStrFreq) ? roundToFourSignificantFigures(currentStrFreq) : roundToFourSignificantFigures(setting.freq/ Math.pow(10, -HzExponent));
      newFreq = newFreq * Math.pow(10, -HzExponent);
      setSetting((currentSetting) => ({
        ...currentSetting,
        freq: newFreq,
      }));
    });
  };


  const handleMeterChange = (option) => {
    setSelectedMeterOption(option);
    setMeterExponent(option.value);
  }
  const dispFreqUnit = (value) => {
    const matchedOption = options.find(option => option.value === value);
    // 一致するオブジェクトがあればその label を返す
    return matchedOption ? matchedOption.label : "";
  }
  const dispMeterUnit = (value) => {
    const matchedOptions = meterOptions.find(option => option.value === value);
    return matchedOptions ? matchedOptions.label : "";
  }
  const handleOnChange = (option) => {
    setSelectedOption(option);
    setHzExponent(option.value);
  };
  return (
    <Box style={{overflow:"visible"}}>
      <FrontHeader>
        <FrontHeaderInner>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>周波数</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <InputItemGrid>
            </InputItemGrid>
            <InputItemGrid>
              <JustFlexRow >
                <SmallLabel>周波数 [ {dispFreqUnit(HzExponent)} ] : </SmallLabel>
                <InputText
                  key={'freq'}
                  maxLength="12"
                  type="text"
                  value={strFreqExponent}
                  style={{ marginRight: "2px" }}
                  onChange={handleInputChange()}
                  onKeyDown={handleKeyDown()}
                />
                <Select
                  options={options}
                  styles={customStyles}
                  value={selectedOption}
                  onChange={handleOnChange}
                  isSearchable={false}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />


              </JustFlexRow>
              <JustFlexRow>
                <FreeSpaceTextWrapper><FreeSpaceText>自由空間波長 [ {dispMeterUnit(meterExponent)} ] : </FreeSpaceText><FreeSpaceText style={{ fontSize: "16px", minWidth: "80px", textAlign: "right", paddingRight: "5px", paddingLeft: "10px" }}>{strMeterExponent}</FreeSpaceText></FreeSpaceTextWrapper>
                <Select
                  options={meterOptions}
                  styles={customStyles}
                  value={selectedMeterOption}
                  onChange={handleMeterChange}
                />
                <FreeSpaceTextWrapper style={{paddingLeft:"20px"}}><FreeSpaceText>自由空間における分割数 [λ/格子幅] : </FreeSpaceText><FreeSpaceText style={{ fontSize: "18px", minWidth: "20px", textAlign: "right", paddingRight: "10px", paddingLeft: "5px" }}>{lambdaperDx}</FreeSpaceText></FreeSpaceTextWrapper>
              </JustFlexRow>

            </InputItemGrid>
          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};
/*
              <ContentBodyRow>
                <LabelRow>
                  <EmptyMediumColorIcon></EmptyMediumColorIcon>
                  <ExponentialCell {...freeSpaceExponent} />
                </LabelRow>
              </ContentBodyRow>
*/

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
const getStrFreq = (strFreqValue, fixed) => {
  let freqValue = parseFloat(strFreqValue);
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

const getStrLambda = (strFreqValue, fixed) => {
  let freqValue = parseFloat(strFreqValue);
  let value; let unit;
  let lambda = 3e8 / freqValue;

  if (lambda > 1) {
    value = lambda.toFixed(fixed);
    unit = '[ m ]';
  } else if (lambda > 1e-3) {
    value = (lambda * 1e3).toFixed(fixed);
    unit = '[ mm ]';
  } else if (lambda < 1e-6) {
    value = (lambda * 1e6).toFixed(fixed);
    unit = '[ um ]';
  } else if (lambda < 1e9) {
    value = (lambda * 1e-9).toFixed(fixed);
    unit = '[ pm ]';
  } else if (lambda < 1e12) {
    value = (lambda * 1e-12).toFixed(fixed);
    unit = '[ fm ]';
  } else {
    value = lambda.toFixed(fixed);
    unit = '[ m ]';
  }
  return value + " " + unit;
};
/*
                    <Text style={{ fontSize: "15px", paddingBottom: "3px", alignSelf: "flex-end" }}>frequency[Hz]: </Text>
                    <Text style={{paddingLeft:"25px",textAlign:"right",width:"120px"}}>{getStrFreq(strFreq,2)}</Text>

*/
const convertToExponential = (num) => {
  if (Number.isInteger(num) && num >= 0 && num <= 100) {
    return {
      mantissa: num.toString(),
      exponent: "",
    };
  }
  const absoluteNumber = Math.abs(num);
  // 指数を計算
  const exponent = Math.floor(Math.log10(absoluteNumber));
  // 仮数を計算
  let mantissa = absoluteNumber / Math.pow(10, exponent);
  // 有効数字を取得（最大5桁）
  const yukosuji = get_yukosuji(mantissa, 4);
  mantissa = formatMantissa(mantissa, yukosuji);
  var str_mantissa = mantissa;
  var str_exponent = exponent.toString();
  if (exponent !== 0) { str_mantissa = mantissa + " ×10"; }
  if (exponent === 0) str_exponent = "";
  return {
    mantissa: str_mantissa,
    exponent: str_exponent
  };
};
function get_yukosuji(number, limit) {
  let strNum = number.toString();
  // 左端から連続する"0"と"."を取り除く
  strNum = strNum.replace(/^0+\.?/, '');
  // 右端から連続する"0"を取り除く（ただし整数部分の0は取り除かない）
  if (strNum.includes('.')) {
    strNum = strNum.replace(/0+$/, '');
  }
  // '.' を除外する
  strNum = strNum.replace('.', '');
  return Math.min(strNum.length, limit);
}

const formatMantissa = (mantissa, yukosuji) => {
  const parts = mantissa.toString().split(".");
  let result = parts[0];

  if (parts.length > 1) {
    const neededLength = yukosuji - parts[0].length;
    result += "." + parts[1].slice(0, neededLength);
  }

  return result;
};

const initFreqExponent = (freqvalue) => {
  if (freqvalue < 1e3) {
    return 0;
  } else if (freqvalue < 1e6) {
    return -3;
  } else if (freqvalue < 1e9) {
    return -6;
  } else if (freqvalue < 1e12) {
    return -9;
  } else if (freqvalue < 1e15) {
    return -12;
  } else {
    return 0;
  }
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