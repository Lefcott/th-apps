/** @format */

import { groupBy } from 'lodash';

export default class GroupPosts {
  static byView = (posts) =>
    groupBy(posts, (post) => {
      let now = Date.now();
      let eventStartDate = new Date(post.startDate).setHours(0); // this is the ui logic, so its the test logic too. Anything that starts today is active?
      let eventEndDate = post.endDate
        ? new Date(post.endDate).getTime()
        : new Date().setHours(23);

      if (eventStartDate > now) return 'upcoming';
      if (eventEndDate < now) return 'ended';
      if (eventStartDate <= now < eventEndDate) return 'active';
    });

  static byAudience = (posts) =>
    groupBy(posts, (post) => {
      if (post.audiences.includes('Resident')) return 'Resident';
      if (post.audiences.includes('Family')) return 'Family';
      if (post.audiences.includes('Voice')) return 'Voice';
    });
}
