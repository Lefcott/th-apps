import React from 'react';
import styled from '@emotion/styled';
import { Dialog, DialogContent } from '@material-ui/core';
import Lottie from 'react-lottie';
import * as loaderData from '../utils/animatedIcons/Loading.json';

const Header = styled.div`
  font-size: 20px;
  color: #474848;
`;
function LoadingModal() {
  return (
    <Dialog open={true} id="CL_loadingModal">
      <DialogContent style={{ padding: 30 }}>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: loaderData.default,
            rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
          }}
          height={200}
          width={150}
        />
        <Header>We're working on your request.</Header>
      </DialogContent>
    </Dialog>
  );
}

export default LoadingModal;
