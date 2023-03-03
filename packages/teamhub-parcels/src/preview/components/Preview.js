import React from "react";
import ReactIframe from "react-iframe";
import { useQuery } from "@apollo/client";
import { GET_CONTENT } from "@graphql/content";

import { generateIdFn } from '@shared/utils';
import { Box, IconButton, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Close } from "@material-ui/icons";

const useTypographyStyles = makeStyles((theme) => ({
  root: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
    fontSize: theme.spacing(3),
    padding: theme.spacing(1),
  },
}));

const useButtonStyles = makeStyles((theme) => ({
  root: {
    color: "#fff",
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(0.25),
  },
}));

export default function ({ parcelData, unmountSelf }) {
  const genId = generateIdFn("Preview")
  const theme = useTheme();
  const typographyClasses = useTypographyStyles();
  const buttonClasses = useButtonStyles();

  const { communityId, documentId } = parcelData;
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: {
      communityId,
      documentId,
    },
  });

  return (
    !loading && (
      <Box
        bgcolor="#fff"
        display="flex"
        position="absolute"
        flexDirection="column"
        left={0}
        top={0}
        width="100%"
        height="100%"
        zIndex={99999}
      >
        <Box classes={typographyClasses}>Preview</Box>
        <IconButton id={genId('close')} aria-label="close-modal" classes={buttonClasses} onClick={unmountSelf}>
          <Close />
        </IconButton>

        <Box
          flex={1}
          p={2}
          border={`4px solid ${theme.palette.primary.main}`}
          borderTop="none"
        >
          <ReactIframe
            id={genId('document')}
            frameBorder={0}
            title='document'
            url={`${data.community.content.rendered}&showControls=true`}
            height="100%"
            width="100%"
          />
        </Box>
      </Box>
    )
  );
}
