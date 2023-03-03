/** @format */

export const EventVideoSourceOrigin = {
  DVD: 'dvd',
  YOUTUBE_VIDEO: 'youtube_video',
  YOUTUBE_PLAYLIST: 'youtube_playlist',
  YOUTUBE_LIVE: 'youtube_live',
  VIMEO: 'vimeo_video',
};

export const EventVideoSourceType = {
  DVD: 'DVD',
  WEB: 'Web',
};

export const EventVideoSource = {
  [EventVideoSourceOrigin.DVD]: {
    name: 'DVD',
    priority: 1,
    _id: EventVideoSourceOrigin.DVD,
    type: EventVideoSourceType.DVD,
  },
  [EventVideoSourceOrigin.YOUTUBE_VIDEO]: {
    name: 'Youtube Video',
    priority: 2,
    _id: EventVideoSourceOrigin.YOUTUBE_VIDEO,
    type: EventVideoSourceType.WEB,
  },
  [EventVideoSourceOrigin.YOUTUBE_PLAYLIST]: {
    name: 'Youtube PlayList',
    priority: 3,
    _id: EventVideoSourceOrigin.YOUTUBE_PLAYLIST,
    type: EventVideoSourceType.WEB,
  },
  [EventVideoSourceOrigin.YOUTUBE_LIVE]: {
    name: 'Youtube Live',
    priority: 4,
    _id: EventVideoSourceOrigin.YOUTUBE_LIVE,
    type: EventVideoSourceType.WEB,
  },
};
