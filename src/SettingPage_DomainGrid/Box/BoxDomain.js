import styled from "styled-components";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  validateInput,
  handleKeyDown,
  updateStringStates,
  isStateComplete,
  isValidNumber
} from './BoxDomain_helper';

import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft
} from './StyledBoxComponents';


const InputText = styled.input`
width:140px;
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
  width:100px;
  font-size:14px;
  text-align:left;
`;

export const BoxDomain = ({
  setting, setSetting,
}) => {
  const [strField, setStrField] = useState({});
  const timeoutIdRef = useRef();

  useEffect(() => {
    if (!isStateComplete(setting)) return;
    updateStringStates(setting, setStrField);
  }, [setting])

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (!validateInput(value)) return;
    clearTimeout(timeoutIdRef.current);
    setStrField((prevState) => ({
      ...prevState,
      [field]: value
    }));
    startSetInputTimer();
  };

  const startSetInputTimer = () => {
    timeoutIdRef.current = setTimeout(handleSetInputTimeout, 1600);
  };
  const handleSetInputTimeout = () => {
    setStrField((current) => {
      let updated = {
        fieldX: isValidNumber(current.fieldX) ? roundToFourSignificantFigures(current.fieldX) : setting.fieldX,
        fieldY: isValidNumber(current.fieldY) ? roundToFourSignificantFigures(current.fieldY) : setting.fieldY
      }
      setSetting({...setting,...updated});
    })
  };

  const inputFields = [
    { name: "x軸の幅 [ m ] : ", field: 'fieldX' },
    { name: "y軸の幅 [ m ] : ", field: 'fieldY' }
  ];
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner style={{ padding: "4px 20px 3px 20px" }}>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>x軸・y軸の幅</CustomH3>
            </TitleWrapper>

          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            {strField !== undefined && strField.fieldX !== undefined && (
              <InputItemGrid>
                {inputFields.map(({ name, field }, index) => {

                  const value = strField[field];
                  return (
                    <JustFlexRow key={field}>
                      <SmallLabel>{name}</SmallLabel>
                      <InputText
                        key={field}
                        maxLength="12"
                        type="text"
                        value={value}
                        onChange={handleInputChange(field)}
                        onKeyDown={handleKeyDown()}
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
