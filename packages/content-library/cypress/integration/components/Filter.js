import { Click, Type } from '../interactions';

/**
 * Filter component namespace, these are the filters under the toolbar for the content (search, filter, etc.)
 * @prop {object} view the selectors for the view filter
 * @prop {object} sort the selectors for the sort filter
 * @prop {string} search the selector for the searchbar in the filter
 *
 */
export const F = {
  view: {
    dropdown: '.CL_viewFilter',
    option: {
      myContent: '.CL_viewFilter-mine',
      communityContent: '.CL_viewFilter-all',
    },
  },
  sort: {
    dropdown: '#CL_grid-sort',
    option: {
      date: { asc: '#CL_sort-dateAsc', desc: '#CL_sort-dateDesc' },
      name: { a2z: '#CL_sort-nameAsc', z2a: '#CL_sort-nameDesc' },
    },
  },
  search: '#CL_library-search',
};
/**
 * This abstracts the actions relating to the content Filter
 * @namespace Filter
 * @example Filter.theView('./file.png')
 */
export default class Filter {
  /**
   * Filters the view to personal or community content
   */
  static theView = () => {
    Click.on(F.view.dropdown);
    return {
      toCommunityContent: () => Click.on(F.view.option.communityContent),
      toMyContent: () => Click.on(F.view.option.myContent),
    };
  };

  /**
   * Filters the view to personal or community content
   */
  static theSort = () => {
    Click.on(F.sort.dropdown);

    return {
      toDate: {
        asc: () => Click.on(F.sort.option.date.asc),
        desc: () => Click.on(F.sort.option.date.desc),
      },
      toName: {
        a2z: () => Click.on(F.sort.option.name.a2z),
        z2a: () => Click.on(F.sort.option.name.z2a),
      },
    };
  };

  /**
   * Searches title of docs
   */
  static theSearch(searchTerm) {
    Type.theText(searchTerm).into(F.search);
  }
}
