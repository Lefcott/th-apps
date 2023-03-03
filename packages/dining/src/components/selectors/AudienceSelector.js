/** @format */
import { Box, Typography } from '@material-ui/core';
import { includes, xorWith, isEqual } from 'lodash';
import React from 'react';
import { MultiSelectChip } from '../../utils/formComponents';

export const formattedAudiences = {
  Resident: { name: 'Resident App', abbrev: 'Res App', value: 'Resident' },
  Family: { name: 'Friends & Family App', abbrev: 'F&F App', value: 'Family' },
  ResidentVoice: {
    name: 'Resident Voice',
    abbrev: 'Res Voice',
    value: 'ResidentVoice',
  },
};
export default function AudienceSelector({ value, onChange, error }) {
  const audiencesMap = Object.values(formattedAudiences);

  function handleChange(item) {
    const nextValue = xorWith(value, [item.value], isEqual);
    if (nextValue.length) onChange(nextValue);
  }

  return (
    <>
      {audiencesMap.map((audienceItem) => (
        <MultiSelectChip
          key={audienceItem.value}
          style={error ? { backgroundColor: '#FCE7E7' } : {}}
          item={audienceItem}
          selected={includes(value, audienceItem.value)}
          onClick={() => handleChange(audienceItem)}
        />
      ))}

      <Box mt={2}>
        <Typography variant="caption">
          To create designs for digital signage and print, use the widgets
          available in the Creator
        </Typography>
      </Box>
    </>
  );
}
