/** @format */

/// <reference types="Cypress" />

import { YouTube, YT } from "../components";
import Auth from "../utils/Auth";
import { Click, Type, Verify } from "../interactions";
import { UrlOptions } from "../utils/SetupBrowser";

context("Youtube Integration Tests", function () {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Click.on(YT.integrationListBtn);
  });

  it("Should add a not-valid youtube url for a community", function () {
    YouTube.changeLinkTo("this isnt a link it will never work");
    Verify.theElement(YT.helperText.selector).contains(YT.helperText.text);
  });

  it("Should add a valid youtube url for a community, but you still get error text since its not a playlist", function () {
    YouTube.changeLinkTo("https://www.youtube.com/watch?v=-5KAN9_CzSA");
    Verify.theElement(YT.helperText.selector).contains(YT.helperText.text);
  });

  it("Should change the youtube playlist", function () {
    Verify.theElement(YT.playlistPreview).isVisible();
    //get the value of the current youtube playlist url
    cy.get(YT.playlistURLInput)
      .invoke("attr", "value")
      .then((urlInputValue) => {
        //if it's chill make it mellow, otherwise make it chill
        let pl =
          urlInputValue === YT.chillVibesPlaylist.url
            ? YT.mellowVibesPlaylist
            : YT.chillVibesPlaylist;
        YouTube.changeLinkTo(pl.url);
        Verify.theToast.showsUpWithText(
          "YouTube playlist has been published to the K4Community App"
        );
        Verify.theElement(pl.previewImage).isVisible();
        Verify.theElement(YT.helperText.selector).doesntExist();
      });
  });
});
