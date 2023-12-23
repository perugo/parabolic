import { useState, useEffect } from 'react';
export const useFDTDInput = (SimulationData) => {
  const [FDTD_Input, setFDTDInput] = useState({});
  useEffect(() => {
    if (!checker_SIMULATIONDATA(SimulationData)) return;
    const object = makeFDTDInput(SimulationData);
    setFDTDInput(object)
  }, [SimulationData])
  return FDTD_Input;
}


function makeFDTDInput(data) {
  const c = 3.0e8;
  const pmlL = 20;

  const { fieldX, fieldY, nx: inputNx,
    focalDistance, totalPointsX: inputTotalPointsX, freq, theta } = data.setting;
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = data.padding;

  let nx = inputNx;
  const dx = fieldX / nx;
  let ny = Math.ceil(fieldY / dx);

  const totalPointsX = inputTotalPointsX;
  const totalPointsY = ny - paddingTF * 2;

  const bitmap=makeBitmap(totalPointsX,ny,data.padding,focalDistance,dx);
  

  nx += 2 * pmlL;
  ny = ny + 2 * pmlL;

  const scatteredPointsX = nx - pmlL - paddingTF - totalPointsX;
  const scatteredPointsY = pmlL + paddingTF;

  //bitmap = check_EMPTYBITMAP([], totalPointsX, totalPointsY);
  //let bitmap = makeBitmap();

  const dt = (dx / (c * Math.sqrt(2))) * 0.98;
  let medium = [
    { "DielectricConstant": 1, "DielectricLoss": 0, "MagneticConstant": 1, "MagneticLoss": 0 },
    { "DielectricConstant": 1, "DielectricLoss": 100000000, "MagneticConstant": 1, "MagneticLoss": 0 }
  ];

  let Mediums = [];
  medium.forEach((m) => {
    Mediums.push(makeMedium(m, freq, dt, dx));
  });

  const boundary = {
    TopLeft: { x: scatteredPointsX, y: scatteredPointsY },
    TopRight: { x: scatteredPointsX + totalPointsX - 1, y: scatteredPointsY },
    BottomRight: { x: scatteredPointsX + totalPointsX - 1, y: scatteredPointsY + totalPointsY - 1 },
    BottomLeft: { x: scatteredPointsX, y: scatteredPointsY + totalPointsY - 1 }
  };

  const obj = {
    nx: nx,
    ny: ny,
    pmlL: pmlL,
    bitmap: bitmap,
    totalPointsX: totalPointsX,
    totalPointsY: totalPointsY,
    scatteredPointsX: scatteredPointsX,
    scatteredPointsY: scatteredPointsY,
    boundary: boundary,
    dx: dx,
    dt: dt,
    freq: freq,
    theta: theta,
    amplitudeScaler: data.amplitudeScaler,
    Mediums: Mediums,
    color: data.color
  };
  return obj;
}

function makeBitmap(totalPointsX,ny,padding,focalDistance,dx) {
  const { TF: paddingTF, XRightAntenna: paddingXRightAntenna, XLeftAntenna: paddingXLeftAntenna, YAntenna: paddingYAntenna } = padding;

  const AntennaYnumPoints = ny - 2 * paddingTF - 2 * paddingYAntenna;
  const a = 1 / (4 * focalDistance);
  const AntennaPointsMid = Math.ceil(AntennaYnumPoints / 2);

  let bitmap = Array.from({ length: totalPointsX }).map(() => Array.from({ length: ny - 2 * paddingTF }).fill(0));
  for (let i = 0; i < AntennaYnumPoints; i++) {
    let ji = Math.ceil((a * (dx * (AntennaPointsMid - i)) * (dx * (AntennaPointsMid - i))) / dx);
    if (ji === 0) ji += 1;
    var value = ji + paddingXRightAntenna;
    if ((totalPointsX - value) < 0 || (totalPointsX - value) >= totalPointsX) {
    } else {
      console.log(value);
      bitmap[totalPointsX - value][i + paddingYAntenna] = 1; bitmap[totalPointsX - value + 1][i + paddingYAntenna] = 1; bitmap[totalPointsX - value + 2][i + paddingYAntenna] = 1;
    }
  }
  return bitmap;
}
function makeMedium(m, freq, dt, dx) {
  const E0 = 8.8541878128e-12;  //真空中の誘電率[F/m]
  const M0 = 1.2566370621e-6; //真空中の透磁率 [H/m]
  const {
    DielectricConstant, //複素誘電率実部　ε`エプシロンダッシュ
    DielectricLoss, //複素誘電率虚部　ε``エプシロンダブルダッシュ
    MagneticConstant, //複素透磁率　μ` ミューダッシュ
    MagneticLoss //複素透磁率　μ`` ミューダッシュ
  } = m;


  let Permittivity; //誘電率 
  let ElectricConductivity; //導電率
  let Permeability; //透磁率
  let MagneticConductivity; //導磁率
  Permittivity = DielectricConstant * E0;
  ElectricConductivity = DielectricLoss * 2 * Math.PI * freq * E0;
  Permeability = MagneticConstant * M0;
  MagneticConductivity = MagneticLoss * 2 * Math.PI * freq * M0;
  console.log("dt: " + dt + "  dx: " + dx);

  let ae = (2 * Permittivity - ElectricConductivity * dt) / (2 * Permittivity + ElectricConductivity * dt);
  let be = ((2 * dt) / (2 * Permittivity + ElectricConductivity * dt)) / dx;
  let am = (2 * Permeability - MagneticConductivity * dt) / (2 * Permeability + MagneticConductivity * dt);
  let bm = ((2 * dt) / (2 * Permeability + MagneticConductivity * dt)) / dx;

  const obj = {
    ae: ae,
    be: be,
    am: am,
    bm: bm,
  }
  return obj;
}

export function checker_FDTDINPUT(obj1) {
  if (!obj1) return false;
  const fields = ['nx', 'ny', 'pmlL', 'bitmap', 'totalPointsX', 'totalPointsY',
    'boundary', 'dx', 'dt', 'freq', 'theta', 'amplitudeScaler', 'Mediums', 'color'];
  if (!fields.every(field => obj1.hasOwnProperty(field))) {
    return false;
  }
  return true;
}


export function checker_SIMULATIONDATA(obj) {
  if (!obj) return false;
  if (obj.setting === undefined) return false;
  const settingFields = ['fieldX', 'fieldY', 'nx', 'totalPointsX',
    'focalDistance', 'freq', 'theta'];
  const paddingFields = ['TF', 'XRightAntenna', 'XLeftAntenna', 'YAntenna'];

  const requiredFields = {
    setting: (data) => {
      if (data === undefined) return false;
      return settingFields.every(field => typeof data[field] === 'number');
    },
    padding: (data) => {
      if (data === undefined) return false;
      return paddingFields.every(field => typeof data[field] === 'number');
    },
    amplitudeScaler: (data) => {
      if (data === undefined) return false;
      const requiredAmplitudeScalerFields = ['Select', 'simulationNum', 'SineWave', 'Pulse'];
      if (!requiredAmplitudeScalerFields.every(field => data[field] !== undefined)) return false;
      const { SineWave, Pulse } = data;
      const sinewaveFields = ['slope', 'shift']; const pulseFields = ['peakPosition', 'widthFactor'];
      if (!sinewaveFields.every(field => typeof SineWave[field] === 'number')) return false;
      if (!pulseFields.every(field => typeof Pulse[field] === 'number')) return false;
      return true;
    },
    color: (data) => {
      const colorFields = ['colorThreshold', 'colorTransitionIndex'];
      return colorFields.every(field => typeof data[field] === 'number');
    },
  };

  // Check if each required property exists and is valid
  for (const [key, validator] of Object.entries(requiredFields)) {
    if (!validator(obj[key])) {
      console.log(key);
      return false;

    }
  }
  console.log("checkerSIMULATIONDATA was true");
  return true;
}


export class FDTD2D_PML {
  c;
  nx;
  ny;
  dx;
  pmlL;
  simulationNum;
  omega;
  t;
  bitmap;
  Ez; Ezx; Ezy;
  Hx; Hy;
  ae; be; am; bm;
  aexpml; aeypml; bexpml; beypml;
  amxpml; amypml; bmxpml; bmypml;

  amplitudeScaler;
  freq;
  theta;
  Ta;
  k0;
  totalPointsX; totalPointsY;
  scatteredPointsX; scatteredPointsY;
  boundary;
  cosT; sinT;
  pmlBlocks;
  Mediums;

  constructor(fdtd_input) {
    if (!checker_FDTDINPUT(fdtd_input)) {
      console.error("AT FDTD2D_PML　無効なFDTD_INPUTの入力がありました");
      console.error(fdtd_input);
    }
    console.log("シミュレーション実行");
    console.log(fdtd_input);


    const c = 3e8;
    this.c = c;
    this.nx = fdtd_input.nx;
    this.ny = fdtd_input.ny;
    this.dx = fdtd_input.dx;
    this.pmlL = fdtd_input.pmlL;
    this.amplitudeScaler = fdtd_input.amplitudeScaler;
    this.freq = fdtd_input.freq;
    this.theta = fdtd_input.theta;
    this.scatteredPointsX = fdtd_input.scatteredPointsX;
    this.scatteredPointsY = fdtd_input.scatteredPointsY;
    this.totalPointsX = fdtd_input.totalPointsX;
    this.totalPointsY = fdtd_input.totalPointsY;
    const bitmap = fdtd_input.bitmap;
    const Mediums = fdtd_input.Mediums;
    const { TopLeft, TopRight, BottomRight, BottomLeft } = fdtd_input.boundary;
    this.TopLeft = TopLeft;
    this.TopRight = TopRight;
    this.BottomRight = BottomRight;
    this.BottomLeft = BottomLeft;
    const E0 = 8.8541878128e-12;  //真空中の誘電率[F/m]
    const M0 = 1.2566370621e-6; //真空中の透磁率 [H/m]

    this.dt = fdtd_input.dt;
    this.simulationNum = 0;
    this.t = 0;
    this.Ta = (this.dx / c) * 0.0;
    this.Z0 = Math.sqrt(M0 / E0);
    this.k0 = 2.0 * Math.PI / (c / this.freq);
    const theta_in = this.theta * Math.PI / 180;
    this.cosT = Math.cos(theta_in);
    this.sinT = Math.sin(theta_in);

    /* thisを省く為に thisで宣言した変数と重なるconst変数 を宣言する*/

    const nx = this.nx;
    const ny = this.ny;
    const pmlL = this.pmlL;
    const dx = this.dx;
    const dt = this.dt;

    this.ll = 0.15 * Math.sqrt(this.totalPointsX * this.totalPointsX + this.totalPointsY * this.totalPointsY) * dx;
    if (this.theta === 0) {
      this.ll = 0.35 * Math.sqrt(this.totalPointsX * this.totalPointsX + this.totalPointsY * this.totalPointsY) * dx;
    } else if (this.theta <= 90) {
      this.ll = 0.35 * Math.sqrt(this.totalPointsX * this.totalPointsX + this.totalPointsY * this.totalPointsY) * dx;

    } else if (this.theta >= 180 && this.theta < 270) {
      this.ll = 0.4 * Math.sqrt(this.totalPointsX * this.totalPointsX + this.totalPointsY * this.totalPointsY) * dx;
    } else if (this.theta >= 270) {
      this.ll = 0.4 * Math.sqrt(this.totalPointsX * this.totalPointsX + this.totalPointsY * this.totalPointsY) * dx;
    }

    this.omega = 2 * Math.PI * this.freq;
    this.y = []; this.z = [];
    for (let i = 0; i < nx; i++)this.z[i] = (i - (nx + (nx - this.totalPointsX - 25)) / 2) * this.dx;
    for (let n = 0; n < ny; n++)this.y[n] = (n - (ny) / 2) * this.dx;



    this.Ez = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Ezx = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Ezy = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Hx = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.Hy = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));

    this.ae = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.be = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.am = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));
    this.bm = Array.from({ length: nx }).map(() => Array.from({ length: ny }).fill(0));

    const hikuX = this.scatteredPointsX;
    const hikuY = this.scatteredPointsY;
    var de = dt / E0 / dx;
    var dm = dt / M0 / dx;

    for (let i = 0; i < nx; i++) {
      for (let n = 0; n < ny; n++) {
        this.ae[i][n] = 1;
        this.be[i][n] = de;
        this.am[i][n] = 1;
        this.bm[i][n] = dm;
      }
    }
    for (var i = 0; i < this.totalPointsX; i++) {
      for (var n = 0; n < this.totalPointsY; n++) {
        const m = Mediums[bitmap[i][n]];
        this.ae[i + hikuX][n + hikuY] = m.ae;
        this.be[i + hikuX][n + hikuY] = m.be;
        this.am[i + hikuX][n + hikuY] = m.am;
        this.bm[i + hikuX][n + hikuY] = m.bm;
      }
    }

    const order = 4;
    const M = 8;
    //PML層の誘電率の最大値（PML層は解析領域の外側に進むに従い誘電率が大きくなる）
    //PML層の透磁率の最大値（PML層は解析領域の外側に進むに従い透磁率が大きくなる）
    const pml_conductivity_max = -(E0 / (2.0 * dt)) * (-M) * (order + 1.0) / pmlL;
    const pml_magnetic_max = (M0 / E0) * pml_conductivity_max;

    this.aexpml = new Array(nx).fill(0);
    this.bexpml = new Array(nx).fill(0);
    this.amxpml = new Array(nx).fill(0);
    this.bmxpml = new Array(nx).fill(0);
    this.aeypml = new Array(ny).fill(0);
    this.beypml = new Array(ny).fill(0);
    this.amypml = new Array(ny).fill(0);
    this.bmypml = new Array(ny).fill(0);


    this.pmlBlocks = [];
    this.pmlBlocks.push({ sx: 0, sy: 0, ex: pmlL, ey: ny });
    this.pmlBlocks.push({ sx: nx - pmlL, sy: 0, ex: nx, ey: ny });
    this.pmlBlocks.push({ sx: pmlL, sy: 0, ex: nx - pmlL, ey: pmlL });
    this.pmlBlocks.push({ sx: pmlL, sy: ny - pmlL, ex: nx - pmlL, ey: ny });


    const set_pml = () => {
      const tmp_aepml = 1.0;
      const tmp_bepml = dt / E0 / dx;
      const tmp_ampml = 1.0;
      const tmp_bmpml = dt / M0 / dx;

      for (let i = 0; i < this.nx; i++) {
        this.aexpml[i] = tmp_aepml;
        this.bexpml[i] = tmp_bepml;
        this.amxpml[i] = tmp_ampml;
        this.bmxpml[i] = tmp_bmpml;
      }
      for (let n = 0; n < this.ny; n++) {
        this.aeypml[n] = tmp_aepml;
        this.beypml[n] = tmp_bepml;
        this.amypml[n] = tmp_ampml;
        this.bmypml[n] = tmp_bmpml;
      }
      let l = pmlL - 1.0;

      //左側のPMl
      for (let i = 0; i < pmlL; i++) {

        const te = (l + 1.0) / pmlL;
        const tm = (l + 0.5) / pmlL;

        const sigxe = pml_conductivity_max * Math.pow(te, order);
        const sigxm = pml_magnetic_max * Math.pow(tm, order);
        const a = (2.0 * E0 - sigxe * dt) / (2.0 * E0 + sigxe * dt);
        const b = ((2.0 * dt) / (2.0 * E0 + sigxe * dt)) / dx;
        const cc = (2.0 * M0 - sigxm * dt) / (2.0 * M0 + sigxm * dt);
        const d = ((2.0 * dt) / (2.0 * M0 + sigxm * dt)) / dx;
        this.aexpml[i] = a;
        this.bexpml[i] = b;
        this.amxpml[i] = cc;
        this.bmxpml[i] = d;
        l -= 1.0;
      }
      //右側のPMl
      l = 0.0;
      for (let i = nx - pmlL; i < nx; i++) {
        const te = (l + 1.0) / pmlL;
        const tm = (l + 0.5) / pmlL;
        const sigxe = pml_conductivity_max * Math.pow(te, order);
        const sigxm = pml_magnetic_max * Math.pow(tm, order);
        const a = (2.0 * E0 - sigxe * dt) / (2.0 * E0 + sigxe * dt);
        const b = ((2.0 * dt) / (2.0 * E0 + sigxe * dt)) / dx;
        const cc = (2.0 * M0 - sigxm * dt) / (2.0 * M0 + sigxm * dt);
        const d = ((2.0 * dt) / (2.0 * M0 + sigxm * dt)) / dx;

        this.aexpml[i] = a;
        this.bexpml[i] = b;
        this.amxpml[i] = cc;
        this.bmxpml[i] = d;
        l += 1.0;
      }
      //上側のpml
      l = pmlL - 1.0;
      for (let n = 0; n < pmlL; n++) {
        const te = (l + 1.0) / pmlL;
        const tm = (l + 0.5) / pmlL;
        const sigxe = pml_conductivity_max * Math.pow(te, order);
        const sigxm = pml_magnetic_max * Math.pow(tm, order);
        const a = (2.0 * E0 - sigxe * dt) / (2.0 * E0 + sigxe * dt);
        const b = ((2.0 * dt) / (2.0 * E0 + sigxe * dt)) / dx;
        const cc = (2.0 * M0 - sigxm * dt) / (2.0 * M0 + sigxm * dt);
        const d = ((2.0 * dt) / (2.0 * M0 + sigxm * dt)) / dx;

        this.aeypml[n] = a;
        this.beypml[n] = b;
        this.amypml[n] = cc;
        this.bmypml[n] = d;

        l -= 1.0;
      }
      //下側のpml
      l = 0.0;
      for (let n = ny - pmlL; n < ny; n++) {
        const te = (l + 1.0) / pmlL;
        const tm = (l + 0.5) / pmlL;
        const sigxe = pml_conductivity_max * Math.pow(te, order);
        const sigxm = pml_magnetic_max * Math.pow(tm, order);
        const a = (2.0 * E0 - sigxe * dt) / (2.0 * E0 + sigxe * dt);
        const b = ((2.0 * dt) / (2.0 * E0 + sigxe * dt)) / dx;
        const cc = (2.0 * M0 - sigxm * dt) / (2.0 * M0 + sigxm * dt);
        const d = ((2.0 * dt) / (2.0 * M0 + sigxm * dt)) / dx;

        this.aeypml[n] = a;
        this.beypml[n] = b;
        this.amypml[n] = cc;
        this.bmypml[n] = d;

        l += 1.0;
      }


      this.aexpml[0] = -1.0;
      this.aeypml[0] = -1.0;
      this.bexpml[0] = 0.0;
      this.beypml[0] = 0.0;
      this.amxpml[0] = 1.0;
      this.amypml[0] = 1.0;
      this.bmxpml[0] = dt / M0 / dx;
      this.bmypml[0] = dt / M0 / dx;
      this.aexpml[nx - 1] = -1.0;
      this.aeypml[ny - 1] = -1.0;
      this.bexpml[nx - 1] = 0.0;
      this.beypml[ny - 1] = 0.0;
      this.amxpml[nx - 1] = 1.0;
      this.amypml[ny - 1] = 1.0;
      this.bmxpml[nx - 1] = dt / M0 / dx;
      this.bmypml[ny - 1] = dt / M0 / dx;
    }
    set_pml();
  }


  get_Ez() {
    return this.Ez;
  }
  cal_Ez() {
    for (var i = this.pmlL; i < this.nx - this.pmlL; i++) {
      for (var n = this.pmlL; n < this.ny - this.pmlL; n++) {
        this.Ez[i][n] = this.ae[i][n] * this.Ez[i][n] + this.be[i][n] * (this.Hy[i][n] - this.Hy[i - 1][n])
          - this.be[i][n] * (this.Hx[i][n] - this.Hx[i][n - 1]);
      }
    }
  }
  cal_Hx() {
    for (var i = this.pmlL; i < this.nx - this.pmlL; i++) {
      for (var n = this.pmlL; n < this.ny - this.pmlL; n++) {
        this.Hx[i][n] = this.am[i][n] * this.Hx[i][n] - this.bm[i][n] * (this.Ez[i][n + 1] - this.Ez[i][n]);
      }
    }
  }
  cal_Hy() {
    for (var i = this.pmlL; i < this.nx - this.pmlL; i++) {
      for (var n = this.pmlL; n < this.ny - this.pmlL; n++) {
        this.Hy[i][n] = this.am[i][n] * this.Hy[i][n] + this.bm[i][n] * (this.Ez[i + 1][n] - this.Ez[i][n]);
      }
    }
  }
  cal_Ez_SFTF() {
    const z_front = -this.ll + (this.omega / this.k0) * (this.t);

    //左のEz
    for (let n = this.TopLeft.y; n <= this.BottomLeft.y; n++) {
      const i = this.TopLeft.x;
      const yy = this.y[n]; const xx = this.z[i] - 0.5 * this.dx;
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Hy_inc = 1 / this.Z0 * Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) * this.cosT *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Ez[i][n] += this.be[i][n] * Hy_inc;
      }
    }

    //右のEz
    for (let n = this.TopRight.y; n <= this.BottomRight.y; n++) {
      const i = this.TopRight.x;
      const yy = this.y[n]; const xx = this.z[i] + 0.5 * this.dx;
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Hy_inc = 1 / this.Z0 * Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) * this.cosT *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Ez[i][n] += this.be[i][n] * -Hy_inc;
      }
    }
    //上のEz

    for (let i = this.TopLeft.x; i <= this.TopRight.x; i++) {
      const n = this.TopLeft.y;
      const yy = this.y[n] - 0.5 * this.dx; const xx = this.z[i];
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Hy_inc = (1 / this.Z0) * Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) * this.sinT *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Ez[i][n] += this.be[i][n] * Hy_inc;
      }
    }
    //下のEz
    for (let i = this.BottomLeft.x; i <= this.BottomRight.x; i++) {
      const n = this.BottomLeft.y;
      const yy = this.y[n] + 0.5 * this.dx; const xx = this.z[i];
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Hy_inc = (1 / this.Z0) * Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) * this.sinT *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Ez[i][n] += this.be[i][n] * -Hy_inc;
      }
    }


  }
  cal_Hy_SFTF() {
    const z_front = -this.ll + (this.omega / this.k0) * (this.t);

    //左のHy
    for (let n = this.TopLeft.y; n <= this.BottomLeft.y; n++) {
      const i = this.TopLeft.x - 1;
      const yy = this.y[n]; const xx = this.z[i + 1] - this.dx / 4;
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Ex_inc = Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Hy[i][n] += this.bm[i][n] * -Ex_inc;
      }
    }
    //右のHy
    for (let n = this.TopRight.y; n <= this.BottomRight.y; n++) {
      const i = this.TopRight.x;
      const yy = this.y[n]; const xx = this.z[i] + this.dx / 4;
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Ex_inc = Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Hy[i][n] += this.bm[i][n] * Ex_inc;
      }
    }
  }
  cal_Hx_SFTF() {
    const z_front = -this.ll + (this.omega / this.k0) * (this.t);
    //上のHx

    for (let i = this.TopLeft.x; i <= this.TopRight.x; i++) {
      const n = this.TopLeft.y - 1;
      const yy = this.y[n + 1] - this.dx / 4; const xx = this.z[i];
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Ex_inc = Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Hx[i][n] += this.bm[i][n] * Ex_inc;
      }
    }
    //下のHx
    for (let i = this.BottomLeft.x; i <= this.BottomRight.x; i++) {
      const n = this.BottomLeft.y;
      const yy = this.y[n] + this.dx / 4; const xx = this.z[i];
      const lt = yy * this.sinT + xx * this.cosT;
      if (lt < z_front) {
        const Ex_inc = Math.sin(this.omega * (this.t - this.Ta) - this.k0 * (lt + this.ll)) *
          this.func_amplitudeScaler((z_front - lt) / this.c / this.dt);
        this.Hx[i][n] += this.bm[i][n] * -Ex_inc;
      }
    }

  }
  cal_Ezpml() {
    var addi;
    var addn;
    addi = 0; addn = 0;

    addi = 0; addn = 0;
    //Ez pml
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];
      if (x == 0) { addi = 1; } else { addi = 0; }
      if (x == 0 || x == 1 || x == 2) { addn = 1; } else { addn = 0; }
      for (var i = p_b.sx + addi; i < p_b.ex; i++) {
        for (var n = p_b.sy + addn; n < p_b.ey; n++) {
          this.Ezx[i][n] = this.aexpml[i] * this.Ezx[i][n] + this.bexpml[i] * (this.Hy[i][n] - this.Hy[i - 1][n]);
          this.Ezy[i][n] = this.aeypml[n] * this.Ezy[i][n] - this.beypml[n] * (this.Hx[i][n] - this.Hx[i][n - 1]);
          this.Ez[i][n] = this.Ezx[i][n] + this.Ezy[i][n];
        }
      }
    }
  }
  cal_Hxpml() {
    var limiti;
    var limitn;
    limiti = 0; limitn = 0;
    //Hx pml
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];

      if (x == 0 || x == 1 || x == 3) { limitn = 1; } else { limitn = 0; }
      for (var i = p_b.sx; i < p_b.ex; i++) {
        for (var n = p_b.sy; n < p_b.ey - limitn; n++) {
          this.Hx[i][n] = this.amypml[n] * this.Hx[i][n] - this.bmypml[n] * (this.Ez[i][n + 1] - this.Ez[i][n]);
        }
      }
    }
  }
  cal_Hypml() {
    var limiti;
    var limitn;
    limiti = 0; limitn = 0;
    //Hy pml
    for (var x = 0; x < this.pmlBlocks.length; x++) {
      var p_b = this.pmlBlocks[x];
      if (x == 1) { limiti = 1; } else { limiti = 0; }
      for (var i = p_b.sx; i < p_b.ex - limiti; i++) {
        for (var n = p_b.sy; n < p_b.ey; n++) {
          this.Hy[i][n] = this.amxpml[i] * this.Hy[i][n] + this.bmxpml[i] * (this.Ez[i + 1][n] - this.Ez[i][n]);
        }
      }
    }
  }
  func_amplitudeScaler(simulationNum) {
    if (this.amplitudeScaler.Select === "SineWave") {
      return 1 / (1 + Math.exp(this.amplitudeScaler.SineWave.slope * (simulationNum - this.amplitudeScaler.SineWave.shift)));
    }
    if (this.amplitudeScaler.Select === "Pulse") {
      return Math.exp(-Math.pow((simulationNum - this.amplitudeScaler.Pulse.peakPosition), 2) / (this.amplitudeScaler.Pulse.widthFactor * 400));
    }
    return 100000;
  }
  cal() {
    this.cal_Ez();
    this.cal_Ez_SFTF();
    this.cal_Ezpml();

    this.t += this.dt / 2.0;

    this.cal_Hy();
    this.cal_Hy_SFTF();
    this.cal_Hypml();

    this.cal_Hx();
    this.cal_Hx_SFTF();
    this.cal_Hxpml();
    this.t += this.dt / 2.0;
    this.simulationNum++;
  }
}

export class ColorCode {
  m;
  colormap;
  constructor(max, index) {
    this.m = max;
    this.colormap = new Array(200);
    this.calculateColors(index);
  }
  setM(max) {
    this.m = max;
  }
  calculateColors(index) {
    let r, g, b;

    let slopeF;
    let shiftF;
    let slopeL;
    let shiftL;
    if (index === 0) {
      slopeF = -0.22;
      shiftF = 24.0;
      slopeL = -0.08;
      shiftL = 70.0;
    } else {
      slopeF = -0.3;
      shiftF = 35.0;
      slopeL = -0.11;
      shiftL = 75.0;
    }

    for (let i = 0; i < 100; i++) {
      b = 255;
      r = Math.round(255.0 - 255.0 / (1 + Math.exp(slopeF * (i - shiftF))));
      g = Math.round(255.0 - 255.0 / (1 + Math.exp(slopeL * (i - shiftL))));
      this.colormap[100 - i] = `rgb(${r},${g},${b})`;
    }
    for (let i = 0; i < 100; i++) {
      r = 255;
      b = Math.round(255.0 - 255.0 / (1 + Math.exp(slopeF * (i - shiftF))));
      g = Math.round(255.0 - 255.0 / (1 + Math.exp(slopeL * (i - shiftL))));
      this.colormap[100 + i] = `rgb(${r},${g},${b})`;
    }
  }

  give(value) {
    let v = value / this.m;
    if (v >= 1.0) v = 1.0;
    if (v <= -1.0) v = -1.0;
    const intv = Math.round(v * 99.0) + 100;
    return !isNaN(value) ? this.colormap[intv] : 'rgb(0,0,0)';
  }
}
