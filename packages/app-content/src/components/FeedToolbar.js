/** @format */

import React from 'react';
import styled from '@emotion/styled';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  InputAdornment,
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Search, Clear } from '@material-ui/icons';
import { ArrowDropDown } from '@material-ui/icons';
import { useDebounce } from 'use-debounce';
import { formattedAudiences } from '../utils/audiences';

const buttonGroupStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      paddingTop: 'auto',
      paddingBottom: 'auto',
      width: 'auto',
    },
  },
  buttonGroup: {
    margin: `auto ${theme.spacing(0.75)}px`,
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
    },
  },
  label: {
    padding: 0,
    marginRight: theme.spacing(1.5),
    [theme.breakpoints.up('md')]: {
      padding: '10px 14px 10px 37px',
    },
  },
}));

const Searchbar = withStyles((theme) => ({
  root: {
    flex: 1,
    paddingLeft: 0,
    '& fieldset': {
      borderRadius: '100px',
    },
    '& input:focus ': {
      color: theme.palette.primary,
    },
    '& .MuiFormControl-root': {
      paddingLeft: 0,
    },
    '& .MuiOutlinedInput-input': {
      padding: '18.5px 14px 18.5px 36px',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover': {
        color: '#4c43db',
      },
      '&:hover fieldset': {
        backgroundColor: 'rgba(76, 67, 219, 0.05)',
        border: '2px solid #4c43db',
      },
      '&.Mui-focused fieldset': {
        backgroundColor: 'rgba(76, 67, 219, 0.05)',
        color: '#4c43db',
      },
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      paddingTop: theme.spacing(2),
    },
  },
}))(TextField);

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
  justify-content: flex-start;
  align-items: center;
  padding-left: ${(props) => (props.column ? '16px' : '0px')};
  padding-right: ${(props) => (props.column ? '16px' : '0px')};

  > input {
    margin-right: 10px;
  }
`;

const CustomToggleGroup = withStyles((theme) => ({
  grouped: {
    border: '1px solid rgba(0,0,0, 0.1)',

    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
}))(ToggleButtonGroup);

const CustomToggle = withStyles((theme) => ({
  root: {
    fontSize: '0.875rem',
    padding: '5px 15px',
    '&:hover': {
      color: theme.palette.primary.main,
      background: 'none',
      border: '1px solid rgba(0,0,0, 0.1)',
    },
    '&$selected': {
      color: theme.palette.primary.main,
      background: 'none',
      border: '1px solid rgba(0,0,0, 0.1)',
      '&:hover': {
        color: theme.palette.primary.main,
        background: 'none',
      },
    },
  },
  selected: {},
}))(ToggleButton);

const CustomBorderButton = withStyles(() => ({
  root: {
    border: '1px solid rgba(0,0,0, 0.1)',
    '&:hover': {
      border: '1px solid rgba(0,0,0, 0.1)',
    },
  },
}))(Button);

export default function FeedToolbar(props) {
  const isTablet = useMediaQuery('(max-width:960px)');
  const [localSearch, setLocalSearch] = React.useState('');
  const [dSearch] = useDebounce(localSearch, 300);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // only used on mobile
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);

  const buttonGroupClasses = buttonGroupStyles();

  const handleSearch = ({ target: { value } }) => setLocalSearch(value);
  const handleStatus = (event, value) => {
    if (value !== null) {
      props.setFilters({ status: value });
    }

    if (props.isMobile) {
      setViewAnchorEl(null);
    }
  };
  const handleAudienceToggle = (value) => {
    props.setFilters({ audiences: value });
    setAnchorEl(null);
  };
  // react to debounced local search value
  React.useEffect(() => {
    props.setFilters({ search: dSearch.trim() });
  }, [dSearch]);

  let adornment = <Search />;
  if (localSearch && localSearch.length > 0) {
    if (props.loading) {
      adornment = (
        <CircularProgress
          size={24}
          color="primary"
          onClick={() => setLocalSearch('')}
        />
      );
    } else {
      adornment = (
        <Clear
          style={{ cursor: 'pointer' }}
          onClick={() => setLocalSearch('')}
        />
      );
    }
  }

  function mapAudienceText() {
    if (props.filters.audiences.length > 1) {
      return 'EVERYONE';
    } else {
      return formattedAudiences[props.filters.audiences[0]].name;
    }
  }

  const audiencesMap = Object.values(formattedAudiences);

  return (
    <FlexContainer
      style={{ paddingBottom: !props.isMobile ? '20px' : '0px' }}
      column={props.isMobile || isTablet}
      data-testid="AP_feed-toolbar"
    >
      <Searchbar
        id="AP_nametag-search"
        data-testid="AP_nametag-search"
        value={localSearch}
        color="primary"
        onChange={handleSearch}
        variant="outlined"
        placeholder="Search by title or folder"
        inputProps={{
          'data-testid': 'AP_nametag-search-input',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{adornment}</InputAdornment>
          ),
        }}
      />
      <FlexContainer className={buttonGroupClasses.root}>
        <Typography className={buttonGroupClasses.label} variant="button">
          VIEW
        </Typography>

        {props.isMobile ? (
          <>
            <ButtonGroup
              color="primary"
              aria-label="view split button"
              className={buttonGroupClasses.buttonGroup}
            >
              <CustomBorderButton>
                {props.filters.status.toUpperCase()}
              </CustomBorderButton>
              <CustomBorderButton
                onClick={(e) => setViewAnchorEl(e.target)}
                color="primary"
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                id="AP_view-dropdown"
              >
                <ArrowDropDown />
              </CustomBorderButton>
            </ButtonGroup>
            <Menu
              variant="menu"
              anchorEl={viewAnchorEl}
              open={Boolean(viewAnchorEl)}
              onClose={() => setViewAnchorEl(null)}
            >
              <MenuItem
                id="AP_view-upcoming-mobile"
                onClick={(e) => handleStatus(e, 'Scheduled')}
              >
                Upcoming
              </MenuItem>
              <MenuItem
                id="AP_view-active-mobile"
                onClick={(e) => handleStatus(e, 'Active')}
              >
                Active
              </MenuItem>
              <MenuItem
                id="AP_view-ended-mobile"
                onClick={(e) => handleStatus(e, 'Archived')}
              >
                Ended
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <CustomToggleGroup
              exclusive
              size="small"
              onChange={handleStatus}
              value={props.filters.status}
              variant="outlined"
              color="primary"
            >
              <CustomToggle id="AP_view-upcoming" value="Scheduled">
                UPCOMING
              </CustomToggle>
              <CustomToggle id="AP_view-active" value="Active">
                ACTIVE
              </CustomToggle>
              <CustomToggle
                id="AP_view-ended"
                value="Archived"
                data-testid="AP_view-ended"
              >
                ENDED
              </CustomToggle>
            </CustomToggleGroup>
            <Typography
              className={buttonGroupClasses.label}
              style={{ paddingLeft: '37px' }}
              variant="button"
            >
              AUDIENCE
            </Typography>
          </>
        )}

        <ButtonGroup
          color="primary"
          aria-label="split button"
          className={buttonGroupClasses.buttonGroup}
        >
          <CustomBorderButton>{mapAudienceText()}</CustomBorderButton>
          <CustomBorderButton
            onClick={(e) => setAnchorEl(e.target)}
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            id="AP_audience-dropdown"
          >
            <ArrowDropDown />
          </CustomBorderButton>
          <Menu
            variant="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              id="AP_audience-everyone"
              key="everyone"
              onClick={() =>
                handleAudienceToggle(['Resident', 'Family', 'ResidentVoice'])
              }
            >
              Everyone
            </MenuItem>
            {audiencesMap.map((aud) => (
              <MenuItem
                key={aud.name}
                onClick={() => handleAudienceToggle([aud.value])}
                id={`AP_audience-${aud.value}`}
              >
                {aud.name}
              </MenuItem>
            ))}
          </Menu>
        </ButtonGroup>
      </FlexContainer>
    </FlexContainer>
  );
}
