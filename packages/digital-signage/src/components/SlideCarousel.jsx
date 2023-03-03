/** @format */

import React, { useState, useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { isEqual, get } from 'lodash';
import { useSchedules } from '../contexts/ScheduleProvider';
import { IconButton, LinearProgress, Hidden } from '@material-ui/core';
import { Close, ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import brokenPreview from '../assets/images/brokenPreview.svg';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 2px;
  z-index: 10;
`;

const Loader = styled(LinearProgress)`
  position: absolute;
  bottom: 52px;
  height: 5px;
  width: 100%;
`;

const ArrowButton = styled(IconButton)`
  color: #ffffff;
  padding: 0;
`;

const ControlContainer = styled.div`
  display: flex;
  align-content: center;
  background: #000000;
  width: calc(100% - 40px);
  justify-content: space-between;
  opacity: 75%;
  position: absolute;
  bottom: 0;
  padding: 15px 20px;
  font-size: 18px;
  color: #ffffff;
`;

const MetaName = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Preview = styled.iframe`
  border: none;
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const ErrorThumb = styled.img`
  width: 300px;
  margin: auto;
`;

function SlideCarousel(props) {
  const { data, isNewSchedule } = props;
  const { updateActiveSchedule } = useSchedules();
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const document = (isNewSchedule ? data : data.Document) || { pages: [] };
  const counterText = `${index + 1} / ${get(document, 'pages', []).length}`;

  useEffect(() => {
    if (loaded) {
      setLoaded(false);
      setIndex(0);
    }
    // eslint-disable-next-line
  }, [document]);

  const closeOnClick = () => updateActiveSchedule(null, false);

  const onArrowClick = (direction) => {
    const lastPageIndex = get(document, 'pages', []).length - 1;
    let newIndex;
    if (isEqual(direction, 'back')) {
      newIndex = isEqual(index, 0) ? lastPageIndex : index - 1;
    } else {
      newIndex = isEqual(index, lastPageIndex) ? 0 : index + 1;
    }
    setIndex(newIndex);
  };

  return (
    <Wrapper>
      <Hidden smDown>
        <CloseButton color="secondary" onClick={closeOnClick}>
          <Close />
        </CloseButton>
      </Hidden>

      {document && document.pages && document.pages.length ? (
        <>
          {!loaded && <Loader />}
          <Preview
            title="slide"
            src={`${document.rendered}#/${index}`}
            onLoad={() => setLoaded(true)}
            onError={({ target }) => (target.src = brokenPreview)}
          />

          <ControlContainer>
            <MetaName>{document.name}</MetaName>
            <div>
              <ArrowButton onClick={() => onArrowClick('back')}>
                <ArrowBackIos />
              </ArrowButton>
              <span>{counterText}</span>
              <ArrowButton onClick={() => onArrowClick('next')}>
                <ArrowForwardIos />
              </ArrowButton>
            </div>
          </ControlContainer>
        </>
      ) : (
        <ErrorThumb src={brokenPreview} />
      )}
    </Wrapper>
  );
}

export default SlideCarousel;
