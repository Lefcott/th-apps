import React from 'react';
import cx from 'clsx';
import { isEmpty } from 'lodash';
import { AddCircleOutlineRounded, CloseRounded } from '@material-ui/icons';
import { Box, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import { sendPendoEvent } from '@teamhub/api';
import Strings from '../../constants/strings';

const buttonAddId = 'DN_search-add-button';

function Message({ children }) {
  return (
    <Box my={2} px={2}>
      <Typography variant="caption" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function SearchBar({
  searchText,
  results: items,
  onChange,
  onCreate,
  onAdd,
  loading,
}) {
  const [focus, setFocus] = React.useState(false);
  const [panelDisplayable, setPanelDisplayable] = React.useState(false);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);
  const inputRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const classes = useStyles();

  const hasExactMatch = items.some(
    (item) => item.menuItem.name.toLowerCase() === searchText.toLowerCase()
  );
  const results = React.useMemo(() => {
    const list = [...items];
    list.sort((firstItem, secondItem) => {
      if (
        (firstItem.alreadyAdded || firstItem.newlyAdded) &&
        !secondItem.alreadyAdded &&
        !secondItem.newlyAdded
      ) {
        return -1;
      } else if (
        (secondItem.alreadyAdded || secondItem.newlyAdded) &&
        !firstItem.alreadyAdded &&
        !firstItem.newlyAdded
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    return list;
  }, [items]);

  function outsideClickListener(event) {
    if (!panelRef.current || !inputRef.current) {
      document.removeEventListener('click', outsideClickListener);
      return;
    }

    if (
      !panelRef.current.contains(event.target) &&
      event.target !== inputRef.current &&
      event.target.id !== buttonAddId
    ) {
      setPanelDisplayable(false);
      removeClickListener();
    }
  }

  function removeClickListener() {
    document.removeEventListener('click', outsideClickListener);
  }

  function hideOnClickOutside() {
    if (!panelDisplayable) {
      document.addEventListener('click', outsideClickListener);
    }
  }

  React.useEffect(() => {
    if (focus) {
      hideOnClickOutside();
      setPanelDisplayable(true);
    }
    return panelDisplayable ? removeClickListener : undefined;
  });

  React.useEffect(() => {
    if (focus && !loading) {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.search);
    }
  }, [results]);

  const handleOnFocus = React.useCallback(() => {
    setFocus(true);
  }, []);

  const handleOnBlur = React.useCallback(() => {
    setFocus(false);
  }, []);

  const handleOnChange = React.useCallback((e) => {
    onChange?.(e.target.value.trimStart());
  }, []);

  const handleReset = React.useCallback(() => {
    onChange?.('');
  }, []);

  const handleClickAdd = React.useCallback(
    (result) => () => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.itemAdd);
      onAdd?.(result);
    },
    []
  );

  const handleOnCreate = React.useCallback((event) => {
    sendPendoEvent(Strings.Dining.pendoEvent.menuItem.itemCreate);
    event.preventDefault();
    onCreate();
  }, []);

  const truncatedSearchText =
    searchText.length > 100 ? `${searchText.slice(0, 100)} ...` : searchText;

  return (
    <Box
      display="flex"
      alignItems="center"
      height={48}
      px={2}
      borderRadius={2}
      bgcolor="#FAFAFA"
    >
      <AddCircleOutlineRounded
        className={cx(classes.firstIcon, { active: focus })}
      />
      <input
        ref={inputRef}
        type="text"
        value={searchText}
        placeholder="Add item"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        className={classes.input}
        disabled={!isEmpty(enabledDiningIntegrations)}
      />
      {searchText && (
        <CloseRounded className={classes.secondIcon} onClick={handleReset} />
      )}

      <Box
        ref={panelRef}
        position="absolute"
        right={20}
        top={109}
        display="flex"
        flexDirection="column"
        width="calc(100% - 40px)"
        bgcolor="white"
        boxShadow={4}
        borderRadius={4}
        zIndex={10}
        style={{ display: panelDisplayable && searchText ? 'flex' : 'none' }}
      >
        {results?.length === 0 && !loading && (
          <Message>
            No matches for “
            <span style={{ fontWeight: 700 }}>{truncatedSearchText}</span>”
            found. You can add it as a new item below.
          </Message>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          px={2}
          my={2}
        >
          <Typography style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
            {truncatedSearchText}
          </Typography>
          {!hasExactMatch && (
            <button
              className={classes.headerButton}
              id="MD_Create-new-item"
              onClick={handleOnCreate}
              type="button"
            >
              CREATE NEW
            </button>
          )}
        </Box>

        {results?.length > 0 && (
          <>
            <Divider />

            <Box px={2} mt={2}>
              <Typography
                variant="overline"
                style={{ color: 'rgba(0, 0, 0, 0.87)' }}
              >
                EXISTING ITEMS
              </Typography>
            </Box>

            <Box className={results?.length >= 5 ? classes.itemsList : ''}>
              {results.map((result) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  minHeight={40}
                  px={2}
                  py={1}
                  boxSizing="border-box"
                  key={result.menuItem._id}
                  className={classes.item}
                >
                  <Typography
                    style={{
                      color: 'rgba(0, 0, 0, 0.87)',
                      lineHeight: '1.3',
                      maxWidth: '280px',
                    }}
                    noWrap
                  >
                    {result.menuItem.name}
                  </Typography>

                  {result.alreadyAdded || result.newlyAdded ? (
                    <Typography
                      variant="caption"
                      className={classes.alreadyLabel}
                    >
                      ALREADY ADDED
                    </Typography>
                  ) : (
                    <button
                      id={buttonAddId}
                      type="button"
                      className={classes.button}
                      onClick={handleClickAdd(result.menuItem)}
                    >
                      ADD
                    </button>
                  )}
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  firstIcon: {
    marginRight: `${theme.spacing(2)}px`,
    color: 'rgba(0, 0, 0, .54)',
    '&.active': {
      color: theme.palette.primary.main,
    },
  },
  input: {
    flexGrow: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    color: theme.palette.text.highEmphasis,
    '&:placeholder': {
      color: 'rgba(0, 0, 0, .54)',
    },
    '&::placeholder': {
      color: 'rgba(0, 0, 0, .54)',
    },
  },
  secondIcon: {
    marginLeft: `${theme.spacing(2)}px`,
    color: 'rgba(0, 0, 0, .54)',
    cursor: 'pointer',
  },
  item: {
    '&:hover': {
      backgroundColor: '#FAFAFA',
    },
    '&:last-child': {
      borderRadius: '0px 0px 4px 4px',
    },
  },
  alreadyLabel: {
    fontSize: '10px',
    color: '#9E9E9E',
    textTransform: 'uppercase',
  },
  button: {
    padding: '4px 0 0 0',
    marginLeft: `${theme.spacing(1)}px`,
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '10px',
    fontWeight: 500,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '1.25px',
    cursor: 'pointer',
  },
  headerButton: {
    minWidth: '90px',
    marginLeft: '5px',
    padding: '6px 8px',
    backgroundColor: '#EDECFB',
    border: 'none',
    borderRadius: '4px',
    boxShadow:
      '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)',
    fontSize: '10px',
    fontWeight: 500,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '1.25px',
    cursor: 'pointer',
  },
  itemsList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
}));
