import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { isEqual, isArray, replace } from 'lodash';
import { getPlaceholderIcon } from './utils';
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const CloseButton = styled(IconButton)`
  && {
    padding: 5px;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 2rem;
    z-index: 2;

    @media (max-width: 960px) {
      position: absolute;
    }
  }
`;

const MetaContainer = styled.div`
  display: grid;
  margin-top: 5px;
  padding 15px 15px;
`;

const Title = styled.span`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.3;
`;

const Descriptor = styled.span`
  font-size: 14px;
  line-height: 1.3;
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 5px;

  @media (max-width: 960px) {
    width: auto;
    height: 100%;
    height: -webkit-fill-available;
    height: fill-available;
  }
`;

const PageNumber = styled.span`
  background-color: #ffffff;
  color: #262626;
  padding: 2px 6px;
  margin: 8px;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 75%;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
`;

const ModalContent = styled(DialogContent)`
  && {
    width: 350px;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    @media (max-width: 960px) {
      padding: 0;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
`;

const SlidersContainer = styled.div`
  position: relative;

  @media (max-width: 960px) {
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

function ContentDetails(props) {
  const { data, image, onClose } = props;
  const [index, setIndex] = useState(0);
  const initPreview = isArray(image) ? image[0] : image;
  const [preview, setPreview] = useState(initPreview);
  const isMultiPaged = isArray(image) && image.length > 1;
  const isMobile = useMediaQuery('(max-width:960px)');

  useEffect(() => {
    if (isMultiPaged) {
      const interval = setInterval(loop, 3000);
      return () => {
        setIndex(0);
        clearInterval(interval);
      };
    }
  }, []);

  const loop = () => {
    setIndex((index) => {
      const lastPage = isEqual(index + 1, image.length);
      const newIndex = lastPage ? 0 : index + 1;
      setPreview(image[newIndex]);
      return newIndex;
    });
  };

  const onImageErr = () => {
    const placeholder = getPlaceholderIcon(data.docType);
    setPreview(placeholder);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={isMobile}
      id="CL_contentDetails"
    >
      <CloseButton onClick={onClose} id="CL_contentDetails-close">
        <Close fontSize={isMobile ? 'large' : 'small'} />
      </CloseButton>
      <ModalContent>
        <SlidersContainer>
          {isMultiPaged && (
            <PageNumber>{`${index + 1} of ${image.length}`}</PageNumber>
          )}
          <Image
            src={preview || getPlaceholderIcon(data.docType)}
            onError={onImageErr}
          />
        </SlidersContainer>
        <MetaContainer>
          <Title id="CL_contentDetails-contentName">{data.name}</Title>
          <Descriptor>
            Created: {format(new Date(data.created), 'PP')}
          </Descriptor>
          {isEqual(data.docType, 'design') && (
            <Descriptor id="CL_contentDetails-dimensions">
              Canvas Size:{' '}
              {`${replace(data.dimensions, 'x', ' x ')} ${data.units}`}
            </Descriptor>
          )}
        </MetaContainer>
      </ModalContent>
    </Dialog>
  );
}

export default ContentDetails;
