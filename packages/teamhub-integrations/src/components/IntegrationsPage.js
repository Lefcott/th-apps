import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import IntegrationList from "./IntegrationList";
import { useQuery } from "@teamhub/apollo-config";
import { getCommunityId } from "@teamhub/api";
import { GET_INTEGRATIONS } from "../graphql/integrations";
import FullCount from "./icons/fullcount.png";
import Volante from "./icons/volante.png";
import CardWatch from "./icons/cardwatch.png";
import Youtube from "./icons/youtube.png";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: "10px",
  },
}));

const displayMap = {
  fullcount: {
    displayName: "FullCount",
    icon: FullCount,
  },
  volante: {
    displayName: "Volante",
    icon: Volante,
  },
  cardwatch: {
    displayName: "CardWatch",
    icon: CardWatch,
  },
};

export default function IntegrationsPage(props) {
  const { outerContainer, title } = useStyles();

  const { data, loading, error } = useQuery(GET_INTEGRATIONS, {
    variables: { communityId: getCommunityId() },
  });
  const mappedIntegrations = data?.community?.integrations
    .filter((item) => item.type === "pos")
    .map((item) => ({
      ...item,
      ...displayMap[item.name],
    }));

  return (
    <Grid container direction="column">
      {mappedIntegrations?.length > 0 &&
      mappedIntegrations.map((int) => int.type).includes("pos") ? (
        <>
          <Typography className={title} variant="subtitle1">
            Resident Integrations
          </Typography>
          <IntegrationList scope="resident" integrations={mappedIntegrations} />
        </>
      ) : null}
      <Typography className={title} variant="subtitle1">
        Community Integrations
      </Typography>
      <IntegrationList
        integrations={[
          {
            name: "youtube",
            displayName: "YouTube",
            icon: Youtube,
            type: "content",
            scope: "community",
          },
        ]}
      />
    </Grid>
  );
}
