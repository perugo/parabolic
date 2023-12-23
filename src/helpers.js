export function maker_RECT(set) {
  const { nx, fieldY, fieldX } = set;
  const ny = Math.ceil(fieldY / (fieldX / nx));

  const availableHeight = window.innerHeight - 50;
  const availableWidth = window.innerWidth - 550;

  // Calculate the maximum canvasDx that satisfies both conditions
  const maxCanvasDxHeight = availableHeight / ny;
  const maxCanvasDxWidth = availableWidth / nx;
  const canvasDx = Math.min(maxCanvasDxHeight, maxCanvasDxWidth);

  const RECT = {
    width: canvasDx * nx,
    height: canvasDx * ny,
  };

  return RECT;
}
export function updateLinkBread(showWindow,BREAD,setLinkBread){
  const mappings = {
    home: BREAD.HOME,
    settingDomainGrid: BREAD.SETTING.DOMAINGRID,
    settingInputWave: BREAD.SETTING.INPUTWAVE,
  };
  setLinkBread(mappings[showWindow]);
};