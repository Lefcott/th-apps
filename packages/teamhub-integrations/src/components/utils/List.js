import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  orderBy as _orderBy,
  escapeRegExp as _escapeRegExp,
  sort as _sort,
} from "lodash";
import {
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemText,
  List as MuiList,
  Avatar,
  Divider,
  Button,
  Typography,
} from "@material-ui/core";
import Autosizer from "react-virtualized-auto-sizer";
import { Virtuoso } from "react-virtuoso";
import Highlighter from "react-highlight-words";
const RESIDENT_CONTENT_WIDTH = "175px";
import ListItemInput from "./ListItemInput";

const useListStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
}));

const useHeaderStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    color: "#9E9E9E",
    fontSize: "14px",
    fontWeight: 500,
    maxWidth: RESIDENT_CONTENT_WIDTH,
    marginRight: 0,
  },
}));

const useListItemStyles = makeStyles((theme) => ({
  listSubContainer: {
    flex: "1 1 auto",
  },
  shortWidth: {
    maxWidth: "175px",
    marginRight: 0,
  },
}));

function Headers({ integrationName }) {
  const classes = useHeaderStyles();
  return (
    <MuiListItem>
      <ListItemAvatar>
        <span></span>
      </ListItemAvatar>
      <ListItemText
        primary="Resident"
        primaryTypographyProps={{ className: `${classes.root}` }}
        classes={classes}
      />
      <ListItemText
        primary={`${integrationName} ID`}
        primaryTypographyProps={{ className: `${classes.root}` }}
      />
    </MuiListItem>
  );
}

function ListItem(props) {
  const name = `${props.lastName}, ${props.firstName}`;
  const classes = useListItemStyles();
  return (
    <>
      <ListItemAvatar>
        <Avatar
          src={
            props.thumbnail.includes("/misc/profile") ? null : props.thumbnail
          }
          alt={`${props.fullName} avatar`}
        >
          {`${props.firstName[0]}${props.lastName[0]}`}
        </Avatar>
      </ListItemAvatar>

      <div className={`${classes.listSubContainer} ${classes.shortWidth}`}>
        <Highlighter
          autoEscape={true}
          highlightStyle={{
            backgroundColor: "#FFE4D1",
          }}
          searchWords={[props.filter]}
          textToHighlight={name}
        />
      </div>
      <div className={classes.listSubContainer}>
        <ListItemInput
          resident={props}
          index={props.index}
          integrationName={props.integrationName}
        />
      </div>
    </>
  );
}

export default function List({
  residents,
  matches,
  filter = "",
  integrationName,
  ...props
}) {
  const classes = useListStyles();
  function sortResidents(residents = []) {
    const { linked, unlinked } = splitResidents(residents, matches);

    const orderedUnlinked = _orderBy(
      unlinked,
      ["lastName", "asc"],
      ["firstName", "asc"]
    );
    const orderedLinked = _orderBy(
      linked,
      ["lastName", "asc"],
      ["firstName", "asc"]
    );
    // add a prop "last" so we know to render the enhanced divider separating linked/unlinked
    orderedUnlinked[orderedUnlinked.length - 1] = {
      ...orderedUnlinked[orderedUnlinked.length - 1],
      last: true,
    };
    return [...orderedUnlinked, ...orderedLinked];
  }

  function filterResidents(residents = [], filter) {
    if (filter) {
      const escapedFilter = _escapeRegExp(filter);
      return residents.filter((item) =>
        item.fullName.match(new RegExp(escapedFilter, "ig"))
      );
    } else {
      return residents;
    }
  }

  function createMatchMap() {
    return matches.reduce((acc, match) => {
      if (Array.isArray(acc[match])) {
        acc[match.matchedUserGuid].push(acc);
      } else {
        acc[match.matchedUserGuid] = [match];
      }
      return acc;
    }, {});
  }

  function splitResidents(residents = []) {
    const matches = createMatchMap();
    return residents.reduce(
      (acc, res) => {
        if (res.posIdentifier) {
          acc.linked.push(res);
        } else {
          // we apply matches if found in the map
          acc.unlinked.push({ ...res, matches: matches[res._id] || [] });
        }
        return acc;
      },
      { linked: [], unlinked: [] }
    );
  }

  const renderItem = React.useCallback((index, res) => {
    return (
      <ListItem
        {...res}
        filter={filter}
        integrationName={integrationName}
        index={index}
      />
    );
  });

  const finalResidents = sortResidents(filterResidents(residents, filter));
  return (
    <MuiList classes={classes}>
      <Headers integrationName={props.displayProperties.displayName} />
      <Divider></Divider>
      {filter.length > 0 && finalResidents.length === 0 ? (
        <MuiListItem>
          <ListItemText style={{ textAlign: "center" }}>
            {`We couldn’t find anything matching "${filter}"`}
          </ListItemText>
        </MuiListItem>
      ) : (
        <div style={{ flex: 1 }}>
          <Autosizer>
            {({ height, width }) => (
              <Virtuoso
                computeItemKey={(index) => finalResidents[index]._id}
                style={{ height, width }}
                totalCount={finalResidents.length}
                itemContent={renderItem}
                overscan={800}
                components={{ Item: CustomItem }}
                data={finalResidents}
              />
            )}
          </Autosizer>
        </div>
      )}
    </MuiList>
  );
}

function CustomItem(props) {
  const style = props?.children?.props?.last ? { height: "3px" } : {};
  return (
    <>
      <MuiListItem {...props} component="div" style={{ margin: 0 }}>
        {props.children}
      </MuiListItem>
      <Divider variant="inset" component="li" style={style} />
    </>
  );
}
