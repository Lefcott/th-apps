import React from "react";
import {
  act,
  render,
  rerender,
  screen,
  fireEvent,
} from "@testing-library/react";
import { showToast } from "@teamhub/toast";
import createProvider from "./testUtils/createProvider";
import {
  GET_YOUTUBE_INTEGRATION,
  UPDATE_YOUTUBE_INTEGRATION,
} from "../graphql/youtube";
import IntegrationsPage from "../components/Youtube";

xdescribe("When integrations page is loaded", () => {
  const communityId = "13";

  const existingPlaylist = {
    youtubePlaylistId: "PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr",
    youtubePlaylistUrl:
      "https://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr",
  };

  const existingEmptyPlaylist = {
    youtubePlaylistId: null,
    youtubePlaylistUrl: null,
  };

  const getMediaSettings = {
    request: {
      query: GET_YOUTUBE_INTEGRATION,
      variables: { communityId: "13" },
    },
    result: {
      data: {
        community: {
          mediaSettings: {
            // Add media settings
            youtubePlaylistId: "PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr",
            youtubePlaylistUrl:
              "https://www.youtube.com/playlist?list=PLl92mABTdpcqqwcFsHDgbZnNIis1_Otfr",
          },
        },
      },
    },
  };

  const updateMediaSettingsRequestTemplate = {
    request: {
      query: UPDATE_YOUTUBE_INTEGRATION,
      variables: {
        communityId: "13",
        // Add media settings
        // ...existingEmptyPlaylist
        // ...existingPlaylist
      },
    },
    result: {
      data: {
        community: {
          updateMediaSettings: {
            // Add media settings
            // ...existingEmptyPlaylist
            // ...existingPlaylist
            __typename: "MediaSettings",
          },
          __typename: "Community_",
        },
      },
    },
  };

  describe("and it has media settings data", () => {
    let showToastMock;
    let TestContextProvider;
    beforeAll(async () => {
      jest.useFakeTimers();
      showToastMock = showToast;
      TestContextProvider = createProvider({
        apolloProps: {
          mocks: [getMediaSettings], // TODO I am unable to get media settings to load mocked values.
        },
      });

      act(async () => {
        render(<IntegrationsPage />, {
          wrapper: TestContextProvider,
        });
        jest.advanceTimersByTime(5000);
      });
    });

    it("renders the page with populated input field", async () => {
      let urlInput = await screen.findByTestId("MS-youtube-playlist-input");
      expect(urlInput).toBeInTheDocument();
    });

    xit("renders the page with populated with preview", async () => {
      let preview = await screen.queryByTestId("MS-youtube-playlist-preview");
      expect(preview).toBeInTheDocument();
    });

    xit("does NOT render the action bar with buttons", async () => {
      let actionBar = await screen.queryByTestId(
        "MS-youtube-playlist-action-bar"
      );
      expect(actionBar).toBeNull();
    });
  });
  describe("and it does not have media settings data", () => {
    beforeAll(() => {});

    afterAll(() => {
      let showToastMock = undefined;
    });

    it.todo("renders the page with no url input url field");
  });
  describe("and media setting are updated. ", () => {
    beforeAll(() => {});

    afterAll(() => {
      let showToastMock = undefined;
    });

    it.todo(" it updates the youtube playlist input url field");
  });
});
