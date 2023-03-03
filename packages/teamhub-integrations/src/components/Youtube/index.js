import React, { useState, useEffect } from "react";
import { Grid, Typography, Container, Link, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LaunchIcon from "@material-ui/icons/Launch";
import urlParser from "js-video-url-parser";
import { showToast } from "@teamhub/toast";
import { useQuery, useMutation } from "@teamhub/apollo-config";
import { getCommunityId } from "@teamhub/api";
import UrlPreview from "./url-preview/url-preview";
import Url from "./urlInput";
import BackButton from "../utils/BackButton";
import ActionBar from "./action-bar";
import YouTube from "../icons/youtube.png";
import {
  GET_YOUTUBE_INTEGRATION,
  UPDATE_YOUTUBE_INTEGRATION,
} from "../../graphql/integrations";
import IntegrationIcon from "../utils/IntegrationIcon";

const useStyles = makeStyles((theme) => ({
  topGrid: {
    maxWidth: "65%",
    margin: "0 auto",
  },
  innerContainer: {
    paddingTop: "40px",
    paddingBottom: "40px",
    [theme.breakpoints.down("md")]: {
      paddingTop: "20px",
      paddingBottom: "20px",
    },
  },
  instructions: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  link: {
    display: "inline-flex",
    marginLeft: "0.2rem",
  },
}));

export default function YoutubePage(props) {
  const { topGrid, innerContainer, instructions, link } = useStyles();

  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState();
  const [error, setError] = useState();
  const [savedValue, setSavedValue] = useState();
  const communityId = getCommunityId();

  const query = useQuery(GET_YOUTUBE_INTEGRATION, {
    fetchPolicy: "cache-and-network",
    variables: {
      communityId,
    },
  });

  const { data, refetch } = query;

  const [updateMediaSettings] = useMutation(UPDATE_YOUTUBE_INTEGRATION);

  useEffect(() => {
    const remoteYoutubePlaylistUrl =
      data?.community?.mediaSettings?.youtubePlaylistUrl || "";
    setYoutubePlaylistUrl(remoteYoutubePlaylistUrl);
    setSavedValue(remoteYoutubePlaylistUrl);
  }, [data]);

  const validate = (url) => {
    let videoMeta = urlParser.parse(url);
    return (
      videoMeta?.mediaType === "playlist" && videoMeta?.provider === "youtube"
    );
  };

  const onChange = (event) => {
    setYoutubePlaylistUrl(event?.target?.value);
  };

  const clear = () => {
    setYoutubePlaylistUrl("");
  };

  const update = async () => {
    if (validate(youtubePlaylistUrl) || youtubePlaylistUrl === "") {
      // do update
      setError(false);
      try {
        const ytData = {};
        if (youtubePlaylistUrl === "") {
          ytData.youtubePlaylistUrl = null;
          ytData.youtubePlaylistId = null;
        } else {
          const { list } = urlParser.parse(youtubePlaylistUrl);
          ytData.youtubePlaylistUrl = youtubePlaylistUrl.trim();
          ytData.youtubePlaylistId = list;
        }

        await updateMediaSettings({
          variables: {
            communityId,
            ...ytData,
          },
        });

        setSavedValue(youtubePlaylistUrl);

        showToast(`YouTube playlist has been published to the K4Community App`);
      } catch (e) {
        showToast(`An unexpected error occurred. Please try again later.`, {
          variant: "error",
        });
      }
    } else {
      setError(true);
    }
  };

  const cancel = async () => {
    setError(false);
    await refetch();
  };

  return (
    <div>
      <BackButton>Commmunity Integrations</BackButton>
      <Paper style={{ padding: "10px 15px" }} elevation={0} variant="outlined">
        <IntegrationIcon
          style={{ marginBottom: 0 }}
          integrationName={"YouTube"}
          integrationIcon={YouTube}
        />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={topGrid}
        >
          <Grid className={innerContainer}>
            <Typography
              className={instructions}
              variant="body2"
              data-testid="MS-youtube-instructions-text"
              id="MS-youtube-instructions-text"
            >
              Posting a YouTube playlist will make it available in K4Community
              Plus. Every new video added to your YouTube playlist will
              automatically show as a Post in K4Community Plus. To learn more,
              <Link
                target={"_blank"}
                className={link}
                href="https://support.k4connect.com/knowledgebase/how-do-i-add-youtube-videos-to-the-resident-app/"
              >
                view the support article.
                <LaunchIcon fontSize={"small"} />
              </Link>
            </Typography>
          </Grid>
          <Url
            value={youtubePlaylistUrl || ""}
            clear={clear}
            onChange={onChange}
            error={error}
          />
          <UrlPreview url={youtubePlaylistUrl} validate={validate} />
          {youtubePlaylistUrl !== savedValue && (
            <ActionBar
              isEdit={savedValue !== ""}
              cancel={cancel}
              update={update}
            />
          )}
        </Grid>
      </Paper>
    </div>
  );
}
