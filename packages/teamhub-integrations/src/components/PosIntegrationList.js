import React from "react";
import { GET_RESIDENTS_WITH_POS_MATCHES } from "../graphql/residents";
import { useQuery } from "@teamhub/apollo-config";
import { getCommunityId } from "@teamhub/api";
import { useLocation, Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import { ArrowBack, OpenInNew } from "@material-ui/icons";
import {
  Avatar,
  Typography,
  Paper,
  useTheme,
  Link as MuiLink,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import List from "./utils/List";
import BackButton from "./utils/BackButton";
import IntegrationIcon from "./utils/IntegrationIcon";
import FullCount from "./icons/fullcount.png";
import Volante from "./icons/volante.png";
import CardWatch from "./icons/cardwatch.png";
import TableLoader from "./utils/TableLoader";

const useStyles = makeStyles((theme) => ({
  infoBar: {
    display: "flex",
    alignItems: "space-between",
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paperStyles: {
    padding: "10px 15px",
    height: "fill-available",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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

export default function PosList(props) {
  const location = useLocation();
  const theme = useTheme();
  const integrationName = location?.pathname.split("/")[2];
  const [filter, setFilter] = React.useState("");
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_RESIDENTS_WITH_POS_MATCHES, {
    variables: {
      communityId: getCommunityId(),
      withPotentialMatches: withPotentialMatches(),
    },
  });

  function withPotentialMatches() {
    return integrationName.toLowerCase().trim() !== "cardwatch";
  }

  const displayProperties = displayMap[integrationName];
  if (error) {
    return <p>Something bad happened! Oh no!</p>;
  }

  return (
    <>
      <BackButton>Resident Integrations</BackButton>
      <Paper variant="outlined" elevation={0} className={classes.paperStyles}>
        {loading ? (
          <TableLoader />
        ) : (
          <>
            <div className={classes.infoContainer}>
              <IntegrationIcon
                integrationName={displayProperties.displayName}
                integrationIcon={displayProperties.icon}
              />

              <Typography variant="body2" style={{ fontSize: "14px" }}>
                Need help?{" "}
                <MuiLink
                  style={{ display: "inline-flex", alignItems: "center" }}
                  id={`TI_posUserList-supportArticle`}
                  color="primary"
                  target="_blank"
                  href="https://support.k4connect.com/knowledgebase/managing-point-of-sale-integrations"
                >
                  View support article{" "}
                  <OpenInNew style={{ fontSize: "14px", paddingLeft: "4px" }} />
                </MuiLink>
              </Typography>
            </div>
            <Searchbar onChange={setFilter} />
            <List
              residents={data?.community?.residents || []}
              displayProperties={displayProperties}
              matches={data?.community?.integrationPotentialMatches || []}
              integrationName={integrationName}
              filter={filter}
            ></List>
          </>
        )}
      </Paper>
    </>
  );
}
