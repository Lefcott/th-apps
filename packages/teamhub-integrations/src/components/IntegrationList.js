import React from "react";
import {
  Avatar,
  Paper,
  TableContainer,
  List,
  ListItem,
  ListItemAvatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import IntegrationIcon from "./utils/IntegrationIcon";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  listItem: {
    textDecoration: "none",
    padding: "20px",
  },
}));

export default function IntegrationsList({ integrations, ...props }) {
  const { listItem } = useStyles();
  return (
    <List style={{ marginBottom: "25px" }}>
      {integrations.map((int) => (
        <ListItem
          id={`TI_${int.type}IntegrationList_${int.name}`}
          key={int.name}
          ContainerComponent={Paper}
          component={Link}
          to={`${int.type}/${int.name}`}
          className={listItem}
          button
        >
          <ListItemAvatar>
            <IntegrationIcon
              style={{ marginBottom: 0 }}
              integrationName={int.displayName}
              integrationIcon={int.icon}
            />
          </ListItemAvatar>
          <ListItemSecondaryAction>
            <ChevronRightIcon />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
