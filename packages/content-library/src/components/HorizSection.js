import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { isEqual, includes } from 'lodash';
import { Fab } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import Slider from 'react-slick';
import useWindowDimensions from '../utils/window';

const PaddedWrapper = styled.div`
  padding-bottom: 30px;
`;

const ScrollButton = styled(Fab)`
  && {
    position: absolute;
    left: ${(props) => (isEqual(props.position, 'left') ? '-15px' : undefined)};
    right: ${(props) =>
      isEqual(props.position, 'right') ? '-15px' : undefined};
    display: ${(props) => (props.hidden ? 'none' : 'inline-flex')};
    width: 35px;
    height: 25px;
    background-color: #ffffff;
    z-index: 1;
    :hover {
      background-color: #e6e6e6;
    }
  }
`;

const SliderCarousel = styled(Slider)`
  display: flex;
  align-items: center;
`;

function HorizSection(props) {
  const Container = useRef(null);
  const { width } = useWindowDimensions();
  const { sectionKey, setSliderRefs, sliderRefs } = props;
  const [currentSliderRef, setCurrentSliderRef] = useState();

  useEffect(() => {
    if (currentSliderRef) {
      // sliderRefs.push({sectionKey, slider: currentSliderRef})
      sliderRefs[sectionKey] = currentSliderRef;
      setSliderRefs(sliderRefs);
    }
  }, [currentSliderRef]);

  return (
    <PaddedWrapper ref={Container}>
      <SliderCarousel
        ref={(slider) => setCurrentSliderRef(slider)}
        variableWidth
        infinite={false}
        draggable={false}
        speed={400}
        prevArrow={<ArrowButton position="left" />}
        slidesToScroll={width > 450 ? 3 : 1}
        nextArrow={
          <ArrowButton position="right" container={Container.current} />
        }
      >
        {props.children}
      </SliderCarousel>
    </PaddedWrapper>
  );
}

const ArrowButton = (props) => {
  const {
    position,
    className,
    onClick,
    container,
    slideCount,
    currentSlide,
  } = props;
  const isLeftArrow = isEqual(position, 'left');
  const Icon = isLeftArrow ? ChevronLeft : ChevronRight;

  const isArrowHidden = () => {
    if (isLeftArrow) return includes(className, 'disabled');
    const cardWidth = 239;
    const numLeft = slideCount - currentSlide;
    const remainingWidth = numLeft * cardWidth;
    return container.clientWidth > remainingWidth;
  };

  return (
    <ScrollButton
      className={`CL_library-${position}Arrow`}
      position={position}
      hidden={isArrowHidden()}
      onClick={onClick}
    >
      <Icon />
    </ScrollButton>
  );
};

export default HorizSection;
