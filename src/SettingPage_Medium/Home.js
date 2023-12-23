import styled from "styled-components";
import React, { useState, useEffect } from 'react';

const MainContentWrapper = styled.div`
  padding-left:10px;
  padding-right:10px;
  width:950px;
`
const MainContentInner = styled.div`
  padding-bottom:20px;
  position:relative;
`

const Garbage_Inner = styled.div`
  position:relative;
  height:25px;
  width:30px;
  padding-top:2px;
`

const ColumnLabel = styled.div`
  font-size:16px;
  text-align:right;
  width:100%;
`
const RightSide = styled.div`
  margin-bottom:5px;
  margin-left:10px;
  margin-top:5px;
  background-color:rgb(240,240,240);
  padding-left:20px;
  padding-right:20px;
  padding-top:20px;
`
const SectionColumn = styled.div`
  flex: 1;              // This ensures all children take equal width
  display:flex;
  flex-direction:column;
  height: 100%;
  align-items: center;
`


const SettingBoxContent = styled.div`
  padding-top:16px;
`
const Front = styled.div`
  position:relative;
`
const FrontWrapper = styled.div`
  box-sizing:border-box;
  background-color:rgb(255,255,255);
  border-spacing:0;
  cursor:auto;
  direction 1tr;
  empty-cells:show;
  hyphens:none;
  tab-size:8;
  text-align:left;
  text-indent:0;
  text-transform:none;
  widows:2;
  word-spacing:normal;
  font-weight:400;
  -webkit-font-smoothing:auto;
  word-break:bread-word;
  display:block;
  position:relative;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  &::before{
    content:"";
    position:absolute;
    left:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    border-top: 1px solid #eaeded;
    z-index:1;
  }
  &::after{
    content:"";
    position:absolute;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    box-shadow:0 1px 1px 0 rgba(0,28,36,0,3) 1px 1px 1px 1px 0 rgba(0,28,36,0.15), -1px 1px 1px 0 rgba(0,28,36,0.15);
    mix-blend-mode:multiply;
  }

`

const FrontBody = styled.div`
  position:relative;
  padding-top:16px;
  padding:30px 30px 30px 20px;
`

const AWSStyledButton = styled.button`
  background:#fff;
  color:#545b64;
  border: 1px solid #545b64;
  border-radius: 2px;
  padding: 0.4rem 1.3rem;
  font-weight: 700;
  letter-spacing: .25px;
  display: inline-block;
  cursor: pointer;
  text-align: left;
  font-size: 1.0rem;
  line-height: 1.15;
  animation: none 0s ease 0s 1 normal none running;
  backface-visibility: visible;
  border-collapse: separate;
  border-image: none;
  border-spacing: 0;
  bottom: auto;
  box-shadow: none;
  box-sizing: content-box;
  caption-side: top;
  clear: none;
  clip: auto;
  column-fill: balance;
  column-gap: normal;
  column-span: 1;
  columns: auto;
  content: normal;
  counter-increment: none;
  counter-reset: none;
  direction: ltr;
  empty-cells: show;
  float: none;
  font-family: serif;
  font-style: normal;
  font-variant: normal;
  font-stretch: normal;
  height: auto;
  hyphens: none;
  left: auto;
  list-style: disc outside none;
  margin: 0;
  max-height: none;
  max-width: none;
  min-height: 0;
  opacity: 1;
  orphans: 2;
  outline: medium none invert;
  overflow: visible;
  overflow-x: visible;
  overflow-y: visible;
  page-break-after: auto;
  page-break-before: auto;
  page-break-inside: auto;
  perspective: none;
  perspective-origin: 50% 50%;
  position: static;
  right: auto;
  tab-size: 8;
  table-layout: auto;
  text-align: left;
  text-align-last: auto;
  text-indent: 0;
  text-shadow: none;
  text-transform: none;
  top: auto;
  transform: none;
  transform-origin: 50% 50% 0;
  transform-style: flat;
  transition: none 0s ease 0s;
  unicode-bidi: normal;
  vertical-align: baseline;
  visibility: visible;
  white-space: normal;
  widows: 2;
  width: auto;
  word-spacing: normal;
  z-index: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-family: Amazon Ember,Helvetica Neue,Roboto,Arial,sans-serif;
  display: inline-block;
  min-width: 0;
  -ms-word-break: break-all;
  word-break: break-word;
  &:hover {
    color: #16191f;
    border-color: #16191f;
    background-
  }
  &:active{
    background-color:#EAEDED;
  }
`
const ContentBodyRow = styled.div`
  margin-bottom:4px;
  position:relative;
  display: inline-block;
  display:flex;
`
const RowFlex = styled.div`
  box-sizing:border-box;
  padding:1rem 0;
  padding-left:28px;

`
const MediumColorIcon = styled.div`
  width:32px;
  height:26px;
  margin-top:3px;
  margin-bottom:3px;
  margin:3px 3px 3px 3px;
  border:1px solid black;
`
const SVGWrapper = styled.div`
  height: 20px;
  width: 26px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
`;
const SVGInner = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  margin: auto;
`;
const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2; // Ensure the image is always on top
`;
const LabelCell = styled.div`
  flex: 1;              // This ensures all children take equal width
  height: 100%;
  position:relative;
  -webkit-box-align: center;
  margin-right:5px;
  align-items: center; /* This is for vertical centering when the parent is a flex container */
`
const InputText = styled.input`
  width:100%;
  text-align:right;
  box-sizing: border-box;
  font-size:16px;
  padding:2px;
`
const LabelText = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  vertical-align:bottom;
  height:100%;
  width:100%;
`
//width: 150px;
const LabelRow = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
`
const Input = styled.div`
  display:flex;
  flex:1 1 0%;
  flex-direction:row;
  height:100%;
  position:relative;
  margin-right:5px;
  align-items:center;
`
const InputCell = styled.div`
  flex: 1;              // This ensures all children take equal width
  display:flex;
  height: 100%;
  position:relative;
  -webkit-box-align: center;
  margin-left:10px;
  align-items: center; /* This is for vertical centering when the parent is a flex container */
`



const ButtonReturnWrapper = styled.div`
  text-align: center;
  padding-top:14px;
  align-items: center;
`
const ButtonReturn = styled.div`
  backface-visibility: hidden;
  background-color:rgb(255,153,0);
  border: 0;
  box-sizing: border-box;
  color:rgb(0,0,0);
  cursor: pointer;
  display: inline-block;
  font-family:sans-serif,Arial, Helvetica,Circular,Helvetica,sans-serif;
  font-weight: 500;
  font-size:18px;
  line-height:1.9;
  position: relative;
  text-align: left;
  text-decoration: none;
  letter-spacing:.25px;
  border-radius:4px;
  padding: 0px 22px;
  transition: transform .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover{
    background-color:rgb(236,114,17);
  }
  &:active{
    background-color:#EB5F07;
}
`
const JustFlexRow = styled.div`
display:flex;
flex-direction:row;
gap:40px;
align-items:center;
justify-content:center;
padding-bottom:20px;
`


const MEDIUM_COLOR = ['rgb(255,255,255)', 'rgb(0,255,0)', 'rgb(255,0,0)', 'rgb(0,0,0)', 'rgb(255,225,0)'];
const sections = [
  { label: 'Dielectric Constant', iconSrc: '/epsilondash.svg', altText: 'Dielectric Constant Icon' },
  { label: 'Dielectric Loss', iconSrc: '/epsilondash2.svg', altText: 'Dielectric Loss Icon' },
  { label: 'Magnetic Constant', iconSrc: '/mudash.svg', altText: 'Magnetic Constant Icon' },
  { label: 'Magnetic Loss', iconSrc: '/mudash2.svg', altText: 'Magnetic Loss Icon' }
];
const mediumField = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];

export const Home = ({medium,setMedium, setShowWindow}) => {
  const [inputMedium, setInputMedium] = useState([]);
  const [defaultMedium, setDefaultMedium] = useState([]);
  const [hoveredItemId, setHoveredItemId] = useState(-1);
  const [errorlog, setErrorLog] = useState([]);
  useEffect(() => {
    if (!medium && !medium.length >= 1) return;
    const stringDefaultMedium = medium.slice(0, 1).map(item => ({
      "DielectricConstant": item.DielectricConstant.toString(),
      "DielectricLoss": item.DielectricLoss.toString(),
      "MagneticConstant": item.MagneticConstant.toString(),
      "MagneticLoss": item.MagneticLoss.toString()
    }));
    const stringMedium = medium.slice(1).map(item => ({
      "DielectricConstant": item.DielectricConstant.toString(),
      "DielectricLoss": item.DielectricLoss.toString(),
      "MagneticConstant": item.MagneticConstant.toString(),
      "MagneticLoss": item.MagneticLoss.toString()
    }));
    setDefaultMedium(stringDefaultMedium);
    setInputMedium(stringMedium);

  }, [medium])

  const handleInputChange = (columnIndex, field, value) => {
    if (!/^[0-9.]*$/.test(value)) return;
    setInputMedium((prevInputMedium) => {
      const newMedium = [...prevInputMedium];
      newMedium[columnIndex][field] = value;
      return newMedium;
    });
  };

  function delete_Onclick(index) {
    const newMedium = [...inputMedium];
    newMedium.splice(index, 1);
    setInputMedium(newMedium);
  }

  function handleHover(index) {
    setHoveredItemId(index)
  }
  function handleLeave() {
    setHoveredItemId(-1);
  }
  const handleKeyDown = (e) => {
    // Here we're checking if the key is NOT one of the allowed characters/keys
    if (!/^[0-9.]$/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Tab") {
      e.preventDefault();
    }
  }
  const addMedium = () => {
    setInputMedium([...inputMedium, { 'DielectricConstant': 1, 'DielectricLoss': 0, 'MagneticConstant': 1, 'MagneticLoss': 0 }]);
  }
  const save = () => {
    const error = [];
    inputMedium.forEach(obj => {
      Object.values(obj).forEach(value => {
        const validationResult = isValidNumber(value);
        if (validationResult !== true) {
          error.push(validationResult);
        }
      });
    });
    if (error.length === 0) {
      const floatMedium = inputMedium.map(item => ({
        "DielectricConstant": parseFloat(item.DielectricConstant),
        "DielectricLoss": parseFloat(item.DielectricLoss),
        "MagneticConstant": parseFloat(item.MagneticConstant),
        "MagneticLoss": parseFloat(item.MagneticLoss)
      }));
      const firstTwo = medium.slice(0, 1);
      setMedium([...firstTwo, ...floatMedium]);
      setShowWindow("home");
      setErrorLog(error);
    } else {
      console.error('Errors found:', error);
      setErrorLog(error);
    }
  }

  return (
      <MainContentWrapper>
        <MainContentInner>
          <RightSide>
            <SettingBoxContent>
              <Front>
                <FrontWrapper>
                  <FrontBody>
                    <ContentBodyRow>
                      <Garbage_Inner></Garbage_Inner>
                      <MediumColorIcon style={{ border: '0px solid white' }}></MediumColorIcon>
                      {sections.map((section) => (
                        <SectionColumn key={section.label}>
                          <ColumnLabel>{section.label}</ColumnLabel>
                          <SVGWrapper>
                            <SVGInner>
                              <StyledImg
                                src={`${process.env.PUBLIC_URL}${section.iconSrc}`}
                                alt={section.altText}
                              />
                            </SVGInner>
                          </SVGWrapper>
                        </SectionColumn>
                      ))}
                    </ContentBodyRow>
                    {defaultMedium.map((medium, index) => (
                      <ContentBodyRow key={index}>
                        <Garbage_Inner></Garbage_Inner>
                        <MediumColorIcon style={{ backgroundColor: MEDIUM_COLOR[index] }}></MediumColorIcon>
                        <LabelRow>
                          {mediumField.map((field) => (
                            <LabelCell key={field}>
                              <LabelText>{medium[field]}</LabelText>
                            </LabelCell>
                          ))}
                        </LabelRow>
                      </ContentBodyRow>
                    ))}
                    {inputMedium.map((column, index) => (
                      <ContentBodyRow key={column.id || index}>
                        <Garbage_Inner
                          onMouseEnter={() => handleHover(index)}
                          onMouseLeave={handleLeave}
                          onClick={() => delete_Onclick(index)}
                        >
                          <SVGWrapper style={{ borderRadius: "5px", width: "100%", height: "100%", backgroundColor: hoveredItemId === index ? "gray" : "white" }}>
                            <SVGInner>
                              <StyledImg
                                src={`${process.env.PUBLIC_URL}/svgtrash.svg`}
                                alt="Trash Icon"
                              />
                            </SVGInner>
                          </SVGWrapper>
                        </Garbage_Inner>
                        <MediumColorIcon style={{ backgroundColor: MEDIUM_COLOR[index + 1] }}></MediumColorIcon>

                        <LabelRow>
                          <Input>
                            <InputCell>
                              <InputText
                                maxLength="13"
                                type="text"
                                value={column.DielectricConstant}
                                onChange={(e) => handleInputChange(index, 'DielectricConstant', e.target.value)}
                                onKeyDown={(e) => {
                                  handleKeyDown(e);
                                }}
                              />
                            </InputCell>
                          </Input>
                          <Input>
                            <InputCell>
                              <InputText
                                maxLength="13"
                                type="text"
                                value={column.DielectricLoss}
                                onChange={(e) => handleInputChange(index, 'DielectricLoss', e.target.value)}
                                onKeyDown={(e) => {
                                  handleKeyDown(e);
                                }}
                              />
                            </InputCell>
                          </Input>
                          <Input>
                            <InputCell>
                              <InputText
                                maxLength="13"
                                type="text"
                                value={column.MagneticConstant}
                                onChange={(e) => handleInputChange(index, 'MagneticConstant', e.target.value)}
                                onKeyDown={(e) => {
                                  handleKeyDown(e);
                                }}
                              />
                            </InputCell>
                          </Input>
                          <Input>
                            <InputCell>
                              <InputText
                                maxLength="13"
                                type="text"
                                value={column.MagneticLoss}
                                onChange={(e) => handleInputChange(index, 'MagneticLoss', e.target.value)}
                                onKeyDown={(e) => {
                                  handleKeyDown(e);
                                }}
                              />
                            </InputCell>
                          </Input>
                        </LabelRow>
                      </ContentBodyRow>
                    ))}
                    {inputMedium.length < 4 && (
                      <RowFlex>
                        <AWSStyledButton onClick={() => addMedium()}>媒質を追加</AWSStyledButton>
                      </RowFlex>
                    )}
                    {errorlog.map((value, index) => (
                      <div key={index}>
                        {value}
                      </div>
                    ))}
                  </FrontBody>
                </FrontWrapper>
              </Front>
            </SettingBoxContent>
            <JustFlexRow>
              <ButtonReturnWrapper>
                <ButtonReturn onClick={() => save()}>保存</ButtonReturn>
              </ButtonReturnWrapper>
              <ButtonReturnWrapper>
                <ButtonReturn onClick={() => setShowWindow("home")}>戻る</ButtonReturn>
              </ButtonReturnWrapper>
            </JustFlexRow>
          </RightSide>
        </MainContentInner>
      </MainContentWrapper>
  );
};

function isValidNumber(input) {
  let str = String(input);  // Convert the input to a string
  if (!str.length) {
    return "未入力です";
  }
  if (/e/i.test(str)) {
    return "指数表記は無効です"; // "Scientific notation is invalid"
  }
  // Check for any character that's not 0-9 or .
  if (/[^0-9.-]/.test(str)) {
    return "数字と.以外入力禁止です";
  }
  // Check for more than one period
  if ((str.match(/\./g) || []).length > 1) {
    return ".が二つ以上あります";
  }
  // Check for strings starting with "0" followed by another number without a decimal
  if (str.startsWith('0') && str.length > 1 && str[1] !== '.') {
    return "0の後は.のみ入力可能です";
  }
  // Check for strings starting with "."
  if (str.startsWith('.')) {
    return "数字がない小数点は無効です";
  }
  // Check if string ends with a period or with a 0 after a period
  if (str.endsWith('.') || /0+$/.test(str.split('.')[1] || '')) {
    return "小数点以下の0で終了する値は無効です";
  }

  function countSignificantFigures(str) {
    // If there's a decimal, remove leading zeros and replace the dot
    if (str.includes('.')) {
      str = str.replace('.', '').replace(/^0+/, '');
    } else {
      // If no decimal, remove leading and trailing zeros
      str = str.replace(/^0+|0+$/g, '');
    }
    return str.length;
  }
  const totalSignificantFigures = countSignificantFigures(str);

  if (totalSignificantFigures > 4) {
    return "有効桁数は４桁までです";
  }
  var v = parseFloat(str);
  if (typeof v !== 'number') return "有効な数字ではありません";
  return true;
}