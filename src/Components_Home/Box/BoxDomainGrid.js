import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';

import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, OutlinedButtonContainer, OutlinedButtonText,
} from './StyledBoxComponents';



export const BoxDomainGrid = ({ setShowWindow }) => {

  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner  style={{ padding: "3px 20px 0px 20px" }}>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>解析領域</CustomH3>
            </TitleWrapper>
            <OutlinedButtonContainer>
              <OutlinedButtonText onClick={() => { setShowWindow("settingDomainGrid") }}>設定</OutlinedButtonText>
            </OutlinedButtonContainer>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};