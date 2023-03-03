/** @format */

import React from 'react';
import styled from '@emotion/styled';
import brokenImg from '../assets/broken.svg';

const Image = styled.img`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`;

function BrokenPage() {
  return <Image src={brokenImg} alt="broken" />;
}

export default BrokenPage;
