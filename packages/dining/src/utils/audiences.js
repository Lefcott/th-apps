/** @format */

export const formattedAudiences = {
  Resident: { name: 'Resident App', abbrev: 'Res App', value: 'Resident' },
  Family: { name: 'Friends & Family App', abbrev: 'F&F App', value: 'Family' },
  ResidentVoice: {
    name: 'Resident Voice',
    abbrev: 'Res Voice',
    value: 'ResidentVoice',
  },
};

export const sortedAudiences = ['Resident', 'Family', 'ResidentVoice'];

export const sortAudiences = (audiences) => {
  const copy = [...audiences];
  copy.sort((a, b) => sortedAudiences.indexOf(a) - sortedAudiences.indexOf(b));
  return copy;
};

export const getAbbrevs = (audiences) =>
  sortAudiences(audiences).map((aud) => formattedAudiences[aud].abbrev);
