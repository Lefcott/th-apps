/** @format */
import React from 'react';
import { Check } from '@material-ui/icons';
import styled from '@emotion/styled';
import { useState } from 'react';
import { SketchPicker } from 'react-color';
import { ColorBlock } from '../styleUtils';
import { IconButton } from '@material-ui/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function ColorPicker(props) {
  const [color, setColor] = useState(props.value);
  const [selectingColor, setSelectingColor] = useState(false);

  const handleConfirmColor = (selectedColor) => {
    setColor(selectedColor.hex)
    setSelectingColor(true);
    props.onChange(selectedColor.hex);
  };

  if (selectingColor) {
    return (
      <Container>
        <SketchPicker
          color={color}
          onChange={(selectedColor) => handleConfirmColor(selectedColor)}
        />
      </Container>
    );
  }

  return (
    <ColorBlock
      color={props.value}
      onClick={() => setSelectingColor(true)}
      style={{ cursor: 'pointer' }}
    />
  );
}

export default ColorPicker;
