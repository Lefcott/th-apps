import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/styles";
import { CheckCircle } from "@material-ui/icons";
import { isEqual, get, isFunction, range } from "lodash";
import { generateIdFn } from "@shared/utils";
import { Loader } from "@shared/components";

function CardList({
  name,
  multiselect,
  idFn,
  data,
  onItemSelect,
  selected = [],
  placeholders = 0,
  dataMapper = {},
}) {
  
  const genId = generateIdFn(name);
  const theme = useTheme();
  const { id, image, imageDefault, title, caption } = dataMapper;
  const items = data || [];

  function getKeyValue(item, key, index, defaultValue) {
    const value = isFunction(key) ? key(item, index) : get(item, key);
    return value === undefined ? defaultValue : value;
  }

  function getSelected(item, index) {
    if (!multiselect) return null;
    const isSelected = isFunction(idFn)
      ? idFn(item, selected, index)
      : selected.find((selectedItem) => selectedItem === item);

    return isSelected ? (
      <Box
        zIndex={999}
        position="absolute"
        top={theme.spacing(2)}
        right={theme.spacing(2)}
      >
        <CheckCircle aria-label='item-selected' color="secondary" />
      </Box>
    ) : null;
  }

  function getCardMediaStyles(item, image, i) {
    return { 
      objectFit: getKeyValue(item, image, i) ? 'cover' : 'scale-down' 
    }
  }

  return (
    <Box display="flex" flexWrap="wrap">
      {range(0, placeholders).map((i) => (
        <CardShell aria-label="item-placeholder" key={genId(`placeholder-${i}`)}>
          <Loader />
        </CardShell>
      ))}
      {items.map((item, i) => (
        <CardShell key={getKeyValue(item, id, i)}>
          {getSelected(item, i)}
          <CardActionArea
            aria-label='item-action-area'
            id={genId(`Card-${getKeyValue(item, id, i)}`)}
            onClick={() => onItemSelect(item, i)}
          >
            <CardMedia
              component="img"
              height={142}
              style={getCardMediaStyles(item, image, i)}
              image={getKeyValue(item, image, i) || getKeyValue(item, imageDefault, i)}
              title={getKeyValue(item, title, i)}
            />
            <CardContent>
              <Typography noWrap gutterBottom variant="subtitle1" component="p">
                {getKeyValue(item, title, i)}
              </Typography>
              {caption && (
                <Box minHeight={20}>
                  <Typography noWrap variant="caption" component="p">
                    {getKeyValue(item, caption, i)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </CardActionArea>
        </CardShell>
      ))}
    </Box>
  );
}

const useCardStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: 206,
  },
}));

function CardShell(props, key) {
  const classes = useCardStyles();
  return (
    <Box aria-label={props['aria-label']} role='listitem' position="relative" maxWidth="24%" flex="1 0 21%" m={0.5} key={key}>
      <Card classes={classes}>{props.children}</Card>
    </Box>
  );
}


export default React.memo(CardList, (props, nextProps) => {
  const current = {
    data: props.data,
    selected: props.selected,
    placeholders: props.placeholders,
  };

  const next = {
    data: nextProps.data,
    selected: nextProps.selected,
    placeholders: nextProps.placeholders,
  };

  return isEqual(current, next);
});
