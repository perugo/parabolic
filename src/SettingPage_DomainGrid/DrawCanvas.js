import styled from "styled-components";
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { React } from 'react';

import {
  checker_DRAWDATA,
  checker_NOCHANGE,
  compare_RectNOCHANGE,
  compare_DIFFERORIGNAL,
  checker_PADDING,
  useCanvasAndWidthHeight,
  giveTFPointsX,
  drawAntenna,
  drawBackGround,
  drawCircleText,
} from './DrawCanvas_helper';

const Canvas = styled.canvas`
  position:absolute;
  top:0;
  left:0;
  opacity:1.0;
`
const Container = styled.div`
  position:relative;
  width:100%;
  height:100%;
`
const Layout_Wrapper = styled.div`
  position:relative;
  width:100%;
  height:100%;
`

var canvasDx;
var fieldX;
var xnum;
var ynum;
var dx;
var theta;
var totalPointsX;
var freq;
export const DrawCanvas = ({ drawData,originalDrawData,defaultPadding }) => {
  const layoutWrapperRef = useRef(null); //canvasの親<div>Ref
  const prevDrawDataRef = useRef(null); //一つ前のdrawData
  const originalDrawDataRef=useRef(null);
  const prevRect = useRef(null);

  const ctx1Ref = useRef(null); const canvas1Ref = useRef(null);
  const ctx2Ref = useRef(null); const canvas2Ref = useRef(null);
  const ctx3Ref = useRef(null); const canvas3Ref = useRef(null);
  const ctx4Ref = useRef(null); const canvas4Ref = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);

  const canvasRefs = useMemo(() => ({
    canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref
  }), [canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref]);
  const ctxRefs = useMemo(() => ({
    ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref
  }), [ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref]);
  useCanvasAndWidthHeight(layoutWrapperRef, canvasRefs, ctxRefs, setWidth, setHeight, updateCounter);

  useEffect(()=>{
    if (!checker_DRAWDATA(originalDrawData)) return;
    originalDrawDataRef.current=originalDrawData;
  },[originalDrawData])

  useEffect(() => {
    console.log(drawData);
    if (!checker_DRAWDATA(drawData) || width === 0 || originalDrawDataRef.current===null || !checker_PADDING(defaultPadding)) return;
      //console.log("no change");
    if (checker_NOCHANGE(drawData, prevDrawDataRef.current) && compare_RectNOCHANGE(prevRect, width, height)) {
      return;
    } else {
      console.log("everything else");
      setUpdateCounter(c => c + 1);
      const { setting,padding:inputPadding } = drawData;
      const { fieldX: inputFieldX, fieldY: inputFieldY, nx: inputXnum,
        focalDistance: inputFocalDistance, totalPointsX: inputTotalPointsX, freq: inputFreq, theta: inputTheta } = setting;
      freq = inputFreq;
      theta = inputTheta;
      fieldX = inputFieldX;
      xnum = inputXnum;
      dx = inputFieldX / inputXnum;
      ynum = Math.ceil(inputFieldY / dx);
      canvasDx = width / xnum;
      let tmpTotalPointsX=inputTotalPointsX;
      let tmpFocalDistance=inputFocalDistance;
      let tmpPadding=inputPadding;
      if(compare_DIFFERORIGNAL(drawData,originalDrawDataRef.current)){
        tmpTotalPointsX=0;
        theta=0;
        tmpFocalDistance=inputFieldX*0.55;
        tmpPadding=defaultPadding;
      }
      totalPointsX = giveTFPointsX(tmpTotalPointsX, xnum, ynum, dx, tmpFocalDistance, tmpPadding);
      if (tmpTotalPointsX !== totalPointsX) {
      }
      drawBackGround(ctx4Ref.current, xnum, ynum, canvasDx, totalPointsX, tmpPadding);
      drawAntenna(ctx2Ref.current, ctx3Ref.current, xnum, ynum, totalPointsX, dx, tmpFocalDistance, canvasDx, tmpPadding, fieldX, freq, theta);
      drawCircleText(ctx1Ref.current, xnum, height, dx, canvasDx, tmpFocalDistance, tmpPadding);
    }
    
    //drawData.setting.totalPointsX=totalPointsX;
    prevDrawDataRef.current = drawData;
    prevRect.current = { width: width, height: height };
  }, [drawData, width, height,originalDrawDataRef]);


  return (
    <Container>
      <Layout_Wrapper ref={layoutWrapperRef}>
        <Canvas ref={canvas4Ref} />
        <Canvas ref={canvas3Ref} />
        <Canvas ref={canvas2Ref} style={{ opacity: 0.8 }} />
        <Canvas ref={canvas1Ref} />
      </Layout_Wrapper>
    </Container>
  )
};
