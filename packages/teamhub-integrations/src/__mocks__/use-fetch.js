/* eslint-disable */

const unfurlStub = {
  card: "summary",
  site: "@YouTube",
  url:
    "http://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr",
  title: "Test Playlist for Unit Tests",
  description: "",
  images: [
    {
      url:
        "https://i.ytimg.com/vi/nLAedLT6Xqo/hqdefault.jpg?sqp=-oaymwEWCKgBEF5IWvKriqkDCQgBFQAAiEIYAQ==&rs=AOn4CLB2ZijNRrVKS5z-tQVGGoT8pJxSJA&days_since_epoch=18596",
    },
    {
      url:
        "https://i.ytimg.com/vi/nLAedLT6Xqo/hqdefault.jpg?sqp=-oaymwEWCMQBEG5IWvKriqkDCQgBFQAAiEIYAQ==&rs=AOn4CLDt43jS6qK2Shp0pDSYFrHVbmrm_g&days_since_epoch=18596",
    },
    {
      url:
        "https://i.ytimg.com/vi/nLAedLT6Xqo/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAKHPQiyWyha9C5HQmWphEDxZxvAQ&days_since_epoch=18596",
    },
    {
      url:
        "https://i.ytimg.com/vi/nLAedLT6Xqo/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBgXvMXXXX8a14nfemxJcmnK2MSwg&days_since_epoch=18596",
    },
  ],
  apps: {
    iphone: {
      name: "YouTube",
      id: "544007664",
      url:
        "http://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr&feature=twitter-deep-link",
    },
    ipad: {
      name: "YouTube",
      id: "544007664",
      url:
        "http://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr&feature=twitter-deep-link",
    },
    googleplay: {
      name: "YouTube",
      id: "com.google.android.youtube",
      url:
        "http://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr&feature=twitter-deep-link",
    },
  },
  thumbnail_url:
    "https://i.ytimg.com/vi/nLAedLT6Xqo/hqdefault.jpg?sqp=-oaymwEWCKgBEF5IWvKriqkDCQgBFQAAiEIYAQ==&rs=AOn4CLB2ZijNRrVKS5z-tQVGGoT8pJxSJA&days_since_epoch=18596",
  thumbnail_width: 168,
  thumbnail_height: 94,
  protocol: "twitter_card",
};

export default useFetch = jest.fn().mockImplementation(() => {
  return {
    response: {
      ok: true,
    },
    post: () => {
      return jest.fn().mockImplementation(() => {
        return Promise.resolve(unfurlStub);
      });
    },
  };
});
