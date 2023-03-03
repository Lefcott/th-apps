/** @format */

import { Click, Type, Verify } from "../interactions";

/**
 * YouTube component namespace
 *
 */
export const YT = {
  integrationListBtn: "#TI_contentIntegrationList_youtube",
  playlistURLInput: "#MS-youtube-playlist-input",
  instructions: {
    selector: "#MS-youtube-instructions-text",
    text:
      "Posting a YouTube playlist will make it available in K4Community Plus. Every new video added to your YouTube playlist will automatically show as a Post in K4Community Plus. To learn more,view the support article.",
  },
  helperText: {
    selector: "#MS-youtube-playlist-input-helper-text",
    text: "Please enter a valid YouTube Playlist URL.",
  },
  playlistPreview: '#MS-youtube-playlist-preview[src^="https://i.ytimg.com"]',
  postBtn: "#MS-youtube-playlist-update",
  chillVibesPlaylist: {
    url:
      "https://www.youtube.com/playlist?list=PLfvAqoENo7emT4n51gdh7OZr8ulSxhJA_",
    previewImage:
      '#MS-youtube-playlist-preview[src="https://i.ytimg.com/vi/GfIvfO9o6lo/hqdefault.jpg"]',
  },
  mellowVibesPlaylist: {
    url:
      "https://www.youtube.com/playlist?list=PLfvAqoENo7emjW-lRzC7mWgl8aZjZi1aL",
    previewImage:
      '#MS-youtube-playlist-preview[src="https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg"]',
  },
};

/**
 * This abstracts the actions relating to the YouTube
 * @namespace YouTube
 */
export class YouTube {
  /**
   * Method to change a youtube link for a community
   */
  static changeLinkTo = (link) => {
    Verify.theElement(YT.instructions.selector).contains(YT.instructions.text);
    Verify.theElement(YT.playlistPreview).isVisible();
    Type.theText(link).into(YT.playlistURLInput);
    Click.on(YT.postBtn);
  };
}
