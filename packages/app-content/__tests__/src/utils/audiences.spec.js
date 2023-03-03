/** @format */

import {
  formattedAudiences,
  sortedAudiences,
  sortAudiences,
  getAbbrevs,
} from '../../../src/utils/audiences';
import { shuffle } from 'lodash';

describe('utils - audiences', () => {
  it('should sort audiences in proper order', () => {
    const unsorted = shuffle(sortedAudiences);
    const sorted = sortAudiences(unsorted);
    expect(sorted).toEqual(sortedAudiences);
  });

  it('should get audience abbreviations', () => {
    const abbrevs = sortedAudiences.map(
      (audience) => formattedAudiences[audience].abbrev,
    );
    expect(getAbbrevs(sortedAudiences)).toEqual(abbrevs);
  });
});
