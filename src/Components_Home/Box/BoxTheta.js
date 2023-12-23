import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, SVGInner, StyledImg, RadioButton, RadioButtonInput
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
font-size:19px;
margin:0;
paddingTop:-3px;
line-height:1.1;
`
export const BoxTheta = ({ setting, setSetting }) => {
  const [dispTheta, setDispTheta] = useState(setting.theta+10);//rc-sliderが少数点の値を扱えないため、colorThreshold*100したもの
  const timeoutIdRef = useRef();
  const reserveIdRef = useRef(null);


  useEffect(() => {
    if (setting.theta === undefined) return;
    const obj = setInitialMarks();
  }, [])

  useEffect(() => {
    if (reserveIdRef.current) {
      clearTimeout(reserveIdRef.current);
    }
    reserveIdRef.current = setTimeout(() => {
      setSetting({ ...setting, theta: dispTheta-10 });
      reserveIdRef.current = null;
    }, 600);

    if (timeoutIdRef.current) return;
    setSetting({ ...setting, theta:dispTheta-10 });
    timeoutIdRef.current = setTimeout(() => {
      timeoutIdRef.current = null;
    }, 200);

    return () => {
      if (reserveIdRef.current) {
        clearTimeout(reserveIdRef.current)
      }
    };
  }, [dispTheta]);

  const handleTimeout = () => {
    setSetting({ ...setting, theta: dispTheta });
  };
  const handleThetaSliderChanged = (newValue) => {
    setDispTheta(newValue)
  }
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>入射角度</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <TextRow>
              <Text style={{ fontSize: "14px", padding: "2px 7px 0px 0px" }}>入射角度: </Text>
              <Text style={{margin: "-1px 0px 0px 0px" }}>{dispTheta-10}</Text>
            </TextRow>
            <SliderWrapper>
              <Slider
                value={dispTheta}
                min={0}
                max={20}
                marks={customMarks}
                onChange={handleThetaSliderChanged}
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
const customMarks = {
  0: '-10°',
  10: '0°',
  20: '10°',
};
const setInitialMarks = () => {
  const initialMarks = {};
  let i = 0;
  initialMarks[i] = '';

  for (i = 0; i <= 359; i += 1) {
    if (i % 90 === 0) {
      initialMarks[i] = i.toString();
    } else {
      initialMarks[i] = ' ';
    }
  }
  return initialMarks;
}