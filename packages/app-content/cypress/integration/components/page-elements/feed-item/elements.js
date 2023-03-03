/** @format */

export default {
  feedItem: '.AP_feedItem',
  feedItemNamed: (n) => `.AP_feedItem :contains("${n}")`,
  title: '.AP_feedItem-title',
  startDate: '.AP_feedItem-start',
  endDate: '.AP_feedItem-end',
  audience: '.AP_feedItem-audience',
  category: '.AP_feedItem-category',
  tags: '.AP_feedItem-tags',
  noResults: '#AP_feedItem-noResults',
  noPosts: '#AP_feedItem-noPosts',
  moreMenu: {
    selector: '.AP_feedItem-more',
    edit: '.AP_feedItem-edit',
    end: '.AP_feedItem-endPost',
    endBtn: '.AP_endPost-endPostBtn',
    cancelBtn: '.AP_endPost-endPostCancelBtn',
  },
};
