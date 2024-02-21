export const DEFAULT = {
  SETTING: {
    fieldX: 0.4, fieldY: 0.36,
    nx: 500,
    totalPointsX: 0,
    focalDistance: 0.13,
    freq: 16e9, theta: 0
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
    colorThreshold: 2.5,
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
      { title: "パラボラアンテナ", link: "home" },
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