import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useFetch from "use-http";
import { get } from "lodash";

import DefaultPreview from "./default-preview.svg";

const getUnfurlerUrl = () => {
  const unfurlerUrls = {
    local: "https://content-serverless.k4connect.com/staging/v1/unfurl",
    dev: "https://content-serverless.k4connect.com/dev/v1/unfurl",
    development: "https://content-serverless.k4connect.com/dev/v1/unfurl",
    staging: "https://content-serverless.k4connect.com/staging/v1/unfurl",
    production: "https://content-serverless.k4connect.com/production/v1/unfurl",
    test: "https://content-serverless.k4connect.com/test/v1/unfurl", // for unit testing purpose
  };
  const env = process.env.K4_ENV || "local";
  return unfurlerUrls[env];
};

const useStyles = makeStyles((theme) => ({
  previewBox: (props) => ({
    minHeight: props.loading ? "360px" : "0px",
    width: "100%",
    marginBottom: "60px",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    justifyContent: "center",
    alignItems: "center",
  }),
  previewTextWrapper: {
    backgroundColor: "#134C70",
  },
  previewSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  previewText: {
    color: "white",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  moreMarginTop: {
    marginTop: "15px",
  },
}));

export default function UrlPreview(props) {
  const { url, validate } = props;

  const [previewData, setPreviewData] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    previewBox,
    previewSubtitle,
    previewText,
    previewTextWrapper,
    moreMarginTop,
  } = useStyles({ loading });

  const unfurlerUrl = getUnfurlerUrl();

  const { response, post } = useFetch(unfurlerUrl, {
    cachePolicy: "no-cache",
    cacheLife: 0,
  });

  const mapData = (data = null) => {
    if (!data) {
      return null;
    }

    const dataToDisplay = {
      provider: data?.provider_name || data?.site,
      title: data?.title,
      previewImage: get(data, `thumbnail_url`, data?.url),
    };
    return dataToDisplay;
  };

  const getPreviewData = async (url) => {
    try {
      // set loading true,
      setLoading(true);
      setError(false);
      if (validate(url)) {
        const data = await post("", { url });
        // response is coming above, from the destructured use-fetch
        if (response.ok) {
          setPreviewData(mapData(data));
        } else {
          throw new Error("preview information not available");
        }
      }
      setLoading(false);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    getPreviewData(url);
    // eslint-disable-next-line
  }, [url]);

  if (!url || !validate(url)) return <></>;

  if (error) {
    return (
      <Card className={previewBox}>
        <Grid
          id="MS-youtube-playlist-preview"
          testid="MS-youtube-playlist-preview"
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <img src={DefaultPreview} alt="Preview doesn't exist" />
          <Typography gutterTop variant="caption" className={moreMarginTop}>
            Unable to retrieve preview for the provided Youtube Playlist.
          </Typography>
        </Grid>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={previewBox}>
        <Grid
          id="MS-youtube-playlist-preview"
          testid="MS-youtube-playlist-preview"
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <CircularProgress color="primary" size={50} />
          <Typography variant="caption" className={moreMarginTop}>
            Loading Preview
          </Typography>
        </Grid>
      </Card>
    );
  }

  return (
    <Card className={previewBox}>
      <CardMedia
        component="img"
        alt="Preview Image"
        image={previewData?.previewImage}
        id="MS-youtube-playlist-preview"
        testid="MS-youtube-playlist-preview"
      />
      <CardContent className={previewTextWrapper}>
        <Typography
          variant="caption"
          color="primary"
          className={previewSubtitle}
        >
          YouTube.com
        </Typography>
        <Typography variant="body1" className={previewText}>
          {previewData?.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
