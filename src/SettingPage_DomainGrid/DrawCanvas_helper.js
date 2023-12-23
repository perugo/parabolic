import { useState, useEffect } from 'react';

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

export function checker_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (!check_SETTING_NOCHANGE(obj1.setting, obj2.setting)) return false;
  if (!check_PADDING_NOCHANGE(obj1.padding, obj2.padding)) return false;
  return true;
}

export function compare_ONLYFREQTHETACHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const { setting: setting1, padding: padding1 } = obj1;
  const { setting: setting2, padding: padding2 } = obj2;
  const notFREQTHETAFields = ['fieldX', 'fieldY', 'nx', 'totalPointsX',
    'focalDistance'];
  if (!fieldsMatch(setting1, setting2, notFREQTHETAFields)) return false;
  if (!check_PADDING_NOCHANGE(padding1, padding2)) return false;
  const FREQTHETAfields = ['freq', 'theta'];
  return !fieldsMatch(setting1, setting2, FREQTHETAfields);
}

export const compare_RectNOCHANGE = (prevRect, width, height) => {
  return (prevRect.current.width === width && prevRect.current.height === height);
}

function check_SETTING_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (fieldsMatch(obj1, obj2, settingFields)) return true;
  return false;
}
function check_PADDING_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (fieldsMatch(obj1, obj2, paddingFields)) return true;
  return false;
}

function fieldsMatch(obj1, obj2, fields) {
  return fields.every(field => obj1[field] === obj2[field]);
}
/*
export const useCanvasAndWidthHeight = (layoutWrapperRef, setWidth, setHeight) => {
  const [RECT, setRECT] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const setupDelay = 100;
    const timer = setTimeout(() => {
      if (!layoutWrapperRef.current) return
      const Rect = layoutWrapperRef.current.getBoundingClientRect();
      if (Rect.width === RECT.width && Rect.height === RECT.height) return;
      setRECT(Rect);
      setWidth(Rect.width);
      setHeight(Rect.height);
    }, setupDelay);
    return () => clearTimeout(timer);
  }, [layoutWrapperRef, setWidth, setHeight]);
};
*/
export const useCanvasAndWidthHeight = (layoutWrapperRef, canvasRefs, ctxRefs, setWidth, setHeight, rect) => {
  const [WIDTH, setWIDTH] = useState(0);
  const [HEIGHT, setHEIGHT] = useState(0);

  useEffect(() => {
    const setupDelay = 100;
    const timer = setTimeout(() => {
      if (!layoutWrapperRef.current) return
      const Rect = layoutWrapperRef.current.getBoundingClientRect();
      const Width = Rect.width;
      const Height = Rect.height;

      const { canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref } = canvasRefs;
      const { ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref } = ctxRefs;
      ctx1Ref.current = canvas1Ref.current.getContext('2d');
      ctx2Ref.current = canvas2Ref.current.getContext('2d');
      ctx3Ref.current = canvas3Ref.current.getContext('2d');
      ctx4Ref.current = canvas4Ref.current.getContext('2d');

      if (Width === WIDTH && Height === HEIGHT) return;
      setWIDTH(Width);
      setHEIGHT(Height);
      [canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref].forEach(canvasRef => {
        canvasRef.current.width = Width;
        canvasRef.current.height = Height;
      });
      setWidth(Width);
      setHeight(Height);
    }, setupDelay);
    return () => clearTimeout(timer);
  }, [layoutWrapperRef, canvasRefs, ctxRefs, setWidth, setHeight, rect]);
};

export function giveTFPointsX(totalPointsX, xnum, ynum, dx, focalDistance, PADDING) {
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = PADDING;
  const AntennaYnumPoints = ynum - 2 * paddingTF - 2 * paddingYAntenna;
  const a = 1 / (4 * focalDistance);
  const xTFNumMin = Math.ceil((a * (dx * (AntennaYnumPoints / 2)) * (dx * (AntennaYnumPoints / 2))) / dx) + paddingXRightAntenna + paddingXLeftAntenna;
  const xTFNumMax = xnum - 2 * paddingTF;

  if (xTFNumMax < totalPointsX || totalPointsX <= xTFNumMin) return xTFNumMin;
  return totalPointsX;
}
export function drawBackGround(ctx, xnum, ynum, canvasDx, totalPointsX, PADDING) {
  const WIDTH = xnum * canvasDx;
  const HEIGHT = ynum * canvasDx;
  const { TF: paddingTF } = PADDING;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  lineAnalysis(ctx, 1, 1, WIDTH, 1, 1);
  lineAnalysis(ctx, WIDTH - 1, 1, WIDTH - 1, HEIGHT, 1);
  lineAnalysis(ctx, WIDTH, HEIGHT - 1, 0, HEIGHT - 1, 1);
  lineAnalysis(ctx, 1, HEIGHT, 1, 1, 1);
  const XEnd = xnum - paddingTF;
  const XStart = XEnd - totalPointsX;
  const YStart = paddingTF;
  const YEnd = ynum - paddingTF;
  for (let i = XStart; i <= XEnd; i++) {
    lineGrid(ctx, canvasDx * i, YStart * canvasDx, canvasDx * i, canvasDx * YEnd);
  }
  for (let n = YStart; n <= YEnd; n++) {
    lineGrid(ctx, XStart * canvasDx, n * canvasDx, canvasDx * XEnd, canvasDx * n);
  }

  const pad=1;  
  lineTF(ctx,XStart*canvasDx-pad,YStart*canvasDx-pad,(XEnd)*canvasDx+pad,YStart*canvasDx-pad);
  lineTF(ctx,XEnd*canvasDx+pad,YStart*canvasDx-pad,XEnd*canvasDx+pad,YEnd*canvasDx+pad);
  lineTF(ctx,XEnd*canvasDx+pad,YEnd*canvasDx+pad,XStart*canvasDx-pad,YEnd*canvasDx+pad);
  lineTF(ctx,XStart*canvasDx-pad,YEnd*canvasDx+pad,XStart*canvasDx-pad,YStart*canvasDx-pad);
}

export function drawAntenna(ctx, ctx3, xnum, ynum, totalPointsX, dx, focalDistance, canvasDx, PADDING,fieldX,freq,theta) {
  ctx.fillStyle = "rgba(0,0,0,1)";
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = PADDING;
  const AntennaYnumPoints = ynum - 2 * paddingTF - 2 * paddingYAntenna;
  const a = 1 / (4 * focalDistance);

  const AntennaPointsMid = AntennaYnumPoints / 2;
  const XCenterGP = xnum - paddingTF - paddingXRightAntenna;
  const WIDTH = xnum * canvasDx; const HEIGHT = ynum * canvasDx;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);


  const bitmap = Array.from({ length: totalPointsX }).map(() => Array.from({ length: ynum - 2 * paddingTF }).fill(0));
  for (let i = 0; i < AntennaYnumPoints; i++) {
    var value = Math.ceil((a * (dx * (AntennaPointsMid - i)) * (dx * (AntennaPointsMid - i))) / dx + paddingXRightAntenna);
    if ((totalPointsX - value) < 0 || (totalPointsX - value) >= totalPointsX) {
      console.error("totalPoinstsX-value : " + totalPointsX - value);
    } else {
      bitmap[totalPointsX - value][i+paddingYAntenna] = 1; bitmap[totalPointsX - value + 1][i+paddingYAntenna] = 1; bitmap[totalPointsX - value + 2][i+paddingYAntenna] = 1;

    }

  }



  for (let i = 0; i < AntennaYnumPoints; i++) {
    var value = (a * (dx * (AntennaPointsMid - i)) * (dx * (AntennaPointsMid - i))) / dx;
    ctx.fillRect((XCenterGP - value) * canvasDx, (i + paddingTF+paddingYAntenna) * canvasDx, canvasDx * 3, canvasDx);
  }
  //ctx.clearRect(0, 0, WIDTH, HEIGHT);
  /*
  ctx.fillStyle = "rgba(255,0,0,0.3)";
  for (let i = 0; i < totalPointsX; i++) {
    for (let n = 0; n < AntennaYnumPoints; n++) {
      if (bitmap[i][n] === 1) {
        ctx.fillRect((xnum - totalPointsX - paddingTF + i) * canvasDx, (n + paddingTF + paddingYAntenna) * canvasDx, canvasDx, canvasDx);
      }
    }
  }
  */
  waveLine();
  function waveLine() {
    const lambdainCanvas = WIDTH / (fieldX / (3e8 / freq));
    const interval = lambdainCanvas; // 垂直な線の間隔
    const intervalNum = parseInt(fieldX / (3e8 / freq));

    const StartX = xnum - totalPointsX - paddingTF;
    const StartY = paddingTF;
    const ScatteredY = ynum - 2 * paddingTF;
    let clipPoint = clipPointTheta(totalPointsX, ScatteredY, theta, bitmap);
    ctx3.clearRect(0, 0, WIDTH, HEIGHT);
    ctx3.clearRect(0, 0, WIDTH, HEIGHT);
    ctx3.save();

    ctx3.beginPath();
    ctx3.moveTo(clipPoint[0][0] * canvasDx + (StartX * canvasDx), clipPoint[0][1] * canvasDx + StartY * canvasDx);
    for (var i = 1; i < clipPoint.length; i++) {
      ctx3.lineTo(clipPoint[i][0] * canvasDx + (StartX * canvasDx), clipPoint[i][1] * canvasDx + (StartY * canvasDx));
      //circle(clipPoint[i][0] * canvasDx + (StartX * canvasDx), clipPoint[i][1] * canvasDx + StartY * canvasDx, 3);
    }
    ctx3.closePath();
    ctx3.clip();

    const x_interval = interval * Math.cos((theta) * Math.PI / 180); // x軸方向の間隔
    const y_interval = +interval * Math.cos((theta - 90) * Math.PI / 180); // y軸方向の間隔
    const length = WIDTH * 2;
    const waveAngle = theta + 90;
    let centerX, centerY;
    if (theta < 90) {
      centerX = StartX * canvasDx - 1;
      centerY = StartY * canvasDx - 1;
    } else if (theta < 180) {
      centerX = (StartX + totalPointsX) * canvasDx + 1;
      centerY = StartX * canvasDx - 1;
    } else if (theta < 270) {
      centerX = (StartX + totalPointsX) * canvasDx + 1;
      centerY = (StartY + ScatteredY) * canvasDx + 1;
    } else {
      centerX = (StartX) * canvasDx - 1;
      centerY = (StartY + ScatteredY) * canvasDx + 1;
    }
    let x = centerX; let y = centerY;

    for (let i = 0; i < intervalNum * 2; i++) {
      drawFromCenter(x, y, waveAngle, length);
      x += x_interval;
      y += y_interval;
    }
    ctx3.restore();


    for (let i = 0; i < totalPointsX; i++) {
      for (let n = 0; n < ScatteredY; n++) {
        if (bitmap[i][n] !== 0) {
          ctx3.clearRect(StartX * canvasDx + i * canvasDx, StartY * canvasDx + n * canvasDx, canvasDx, canvasDx);
        }
      }
    }

    function drawFromCenter(X, Y, Ang, Len) {
      // 角度をラジアンに変換
      const radians = Ang * Math.PI / 180;

      // 線の両端の座標を計算
      const endX1 = X + Len / 2 * Math.cos(radians);
      const endY1 = Y + Len / 2 * Math.sin(radians);
      const endX2 = X - Len / 2 * Math.cos(radians);
      const endY2 = Y - Len / 2 * Math.sin(radians);

      line(endX1, endY1, endX2, endY2, 2, "rgba(0,0,255,0.5)");

      function line(x1, y1, x2, y2, w, col) {
        ctx3.strokeStyle = col;
        ctx3.lineWidth = w;
        ctx3.beginPath();
        ctx3.moveTo(x1, y1);
        ctx3.lineTo(x2, y2);
        ctx3.stroke();
      }
    }
    function circle(ix, iy, ir) {
      const x = parseInt(ix);
      const y = parseInt(iy);
      const r = parseInt(ir);
      ctx3.beginPath();
      ctx3.arc(x, y, r, 0, Math.PI * 2, true);
      ctx3.fillStyle = "rgb(0,250,0)";
      ctx3.fill();
      ctx3.strokeStyle = 'black';
      ctx3.lineWidth = 1;
      ctx3.stroke();
    }
  }
}
export function drawCircleText(ctx, xnum, height, dx, canvasDx, focalDistance, PADDING) {
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = PADDING;
  const XFocalGP = (xnum - paddingTF - paddingXRightAntenna - focalDistance / dx) * canvasDx;
  const WIDTH = xnum * canvasDx; const HEIGHT = height;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  circle(ctx, XFocalGP, height / 2, 4);
  drawText(ctx, "焦点", XFocalGP, height / 2 - 15);
}

function clipPointTheta(totalPointsX, totalPointsY, theta, bitmap) {
  let clipPoint;
  if (!check_BITMAP(bitmap, totalPointsX, totalPointsY)) {
    const clipEMPTY = [];
    return clipEMPTY;
  }
  if (theta >= 0) {
    clipPoint = clipPointTheta0_89(totalPointsX, totalPointsY, theta, bitmap);
  } else {
    clipPoint = clipPointTheta270_359(totalPointsX, totalPointsY, theta, bitmap);
  }
  return clipPoint;
}
function check_BITMAP(bitmap, totalPointsX, totalPointsY) {
  if (bitmap.length !== totalPointsX) return false;
  if (!bitmap.every(subArray => Array.isArray(subArray) && subArray.length === totalPointsY)) return false;
  return true;
}

function clipPointTheta0_89(totalPointsX, totalPointsY, theta, bitmap) {
  var clippoint = [];
  let i, n;
  const stepSize = 0.5;
  clippoint.push([Math.round(0), Math.round(totalPointsY)]);
  //clippoint.push([Math.round(totalPointsX), Math.round(totalPointsY)]);


  for (i = 0, n = totalPointsY - 1; n >= 0; n--) {
    let x = i;
    let y = n;
    let v = 0;
    while (v === 0 && (x >= 0 && x < totalPointsX - 1) && (y >= 0 && y < totalPointsY)) {
      x += stepSize * (Math.cos(theta * Math.PI / 180));
      y += stepSize * (Math.sin(theta * Math.PI / 180));
      v = bitmap[Math.round(x)][Math.round(y)];
    }
    //if (v === 0) { x += 1; }
    clippoint.push([Math.round(x), Math.round(y)]);
  }
  //clippoint[clippoint.length - 1][1] += 1;
  clippoint.push([Math.round(0), Math.round(0)]);


  for (i = 0, n = 0; i <= totalPointsX - 1; i++) {
    let x = i;
    let y = n;
    let v = 0;
    while (v === 0 && (x >= 0 && x < totalPointsX - 1) && (y >= 0 && y < totalPointsY)) {
      x += stepSize * (Math.cos(theta * Math.PI / 180));
      y += stepSize * (Math.sin(theta * Math.PI / 180));
      v = bitmap[Math.round(x)][Math.round(y)];
    }
    //if (v === 0) { x += 1; }
    clippoint.push([Math.round(x), Math.round(y)]);
  }
  clippoint.push([Math.round(0), Math.round(0)]);
  return clippoint;
}

function clipPointTheta270_359(totalPointsX, totalPointsY, theta, bitmap) {
  var clippoint = [];
  let i, n;

  const stepSize = 0.45;
  clippoint.push([Math.round(totalPointsX), Math.round(totalPointsY)]);

  for (i = totalPointsX - 1, n = totalPointsY - 2; i >= 0; i--) {
    let x = i;
    let y = n;
    let v = 0;
    while (v === 0 && (x >= 0 && x < totalPointsX - 1) && (y >= 0 && y < totalPointsY - 1)) {
      x += stepSize * (Math.cos(theta * Math.PI / 180));
      y += stepSize * (Math.sin(theta * Math.PI / 180));
      v = bitmap[Math.round(x)][Math.round(y)];
    }
    //if (x >= totalPointsX - 2) { x += 1; }

    clippoint.push([Math.round(x), Math.round(y)]);

  }

  clippoint.push([Math.round(0), Math.round(totalPointsY)]);

  for (i = 0, n = totalPointsY - 2; n >= 0; n--) {
    let x = i;
    let y = n;
    let v = 0;
    while (v === 0 && (x >= 0 && x < totalPointsX - 1) && (y >= 0 && y < totalPointsY - 1)) {
      x += stepSize * (Math.cos(theta * Math.PI / 180));
      y += stepSize * (Math.sin(theta * Math.PI / 180));
      v = bitmap[Math.round(x)][Math.round(y)];
    }
    //if (x >= totalPointsX - 2) { x += 1; }

    clippoint.push([Math.round(x), Math.round(y)]);
  }

  clippoint.push([Math.round(0), Math.round(totalPointsY)]);

  return clippoint;
}

function drawText(ctx, str, x, y) {
  ctx.textBaseline = 'center';
  ctx.textAlign = 'center';
  ctx.font = '500 18px "Times New Roman", serif';
  ctx.fillStyle = "rgba(0,0,0,1.0)";
  ctx.fillText(str, x, y);
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.fillStyle = "rgb(0,250,0)";
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();
}
function lineAnalysis(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function lineGrid(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = "rgb(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function lineTF(ctx,x1,y1,x2,y2) {
  var dashPattern = [9, 6];
  // 点線のスタイルを設定
  ctx.setLineDash(dashPattern);
  // 線の色を設定
  ctx.strokeStyle = 'rgba(50,50,50,0.3)';
  // 線の太さを設定
  ctx.lineWidth = 2;
  // 線を描画
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

}