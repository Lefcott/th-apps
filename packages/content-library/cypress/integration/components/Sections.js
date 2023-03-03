import { Click, Type } from '../interactions';

/**
 * Section component namespace
 * @prop {object} view the selectors for the view filter
 * @prop {object} sort the selectors for the sort filter
 * @prop {string} search the selector for the searchbar in the filter
 *
 */
export const S = {
  seeAll: {
    designs: '#CL_library-seeAll-designs',
    photos: '#CL_library-seeAll-photos',
    documents: '#CL_library-seeAll-documents',
  },
  leftArrow: {
    designs: '#CL_library-design .CL_library-leftArrow',
    photos: '#CL_library-photo .CL_library-leftArrow',
    documents: '#CL_library-document .CL_library-leftArrow',
  },
  rightArrow: {
    designs: '#CL_library-design .CL_library-rightArrow',
    photos: '#CL_library-photo .CL_library-rightArrow',
    documents: '#CL_library-document .CL_library-rightArrow',
  },
};
/**
 * This abstracts the actions relating to the sections
 * @namespace Sections
 * @example Sections.showAll.designs()
 */
export class Sections {
  /**
   * Shows all of the whatever type of content is specified
   */
  static showAll = {
    designs: () => {
      Click.on(S.seeAll.designs);
    },
    photos: () => {
      Click.on(S.seeAll.photos);
    },
    documents: () => {
      Click.on(S.seeAll.documents);
    },
  };
}
