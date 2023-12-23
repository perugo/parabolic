export const DEFAULT = {
  SETTING: {
    fieldX: 0.44, fieldY: 0.36,
    nx: 300,
    totalPointsX: 0,
    focalDistance: 0.2,
    freq: 10e9, theta: 0
  },
  PADDING: {
    TF: 5,
    XRightAntenna: 4,
    XLeftAntenna: 2,
    YAntenna: 3
  },
  AMPLITUDESCALER: {
    "Select": "SineWave", "simulationNum": 1000,
    "SineWave": { "slope": -0.11, "shift": 60 },
    "Pulse": { "peakPosition": 100, "widthFactor": 2.5 }
  },
  COLOR: {
    colorThreshold: 2.2,
    colorTransitionIndex: 0
  }
}

export const BREAD = {
  HOME: [{ title: "パラボラアンテナ", link: "home" }],
  SETTING: {
    DOMAINGRID: [
      { title: "パラボラアンテナ", link: "home" },
      { title: "解析領域の設定", link: "settingDomainGrid" }
    ],
    INPUTWAVE: [
      { title: "平面波入力 (Total Field/ Scattered Field)", link: "home" },
      { title: "波形の設定", link: "settingInputWave" }
    ]
  }
}
/*
波形の設定
解析領域の設定　fieldX,fieldY


周波数の設定
焦点距離の設定
totalFieldの設定 totalPoints

入射角度の設定

色閾値の設定
*/