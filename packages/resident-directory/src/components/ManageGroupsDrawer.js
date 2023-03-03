/** @format */
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import GroupsDrawerEmptyState from './GroupsDrawerEmptyState';
import React from 'react';
import { RESIDENT_GROUPS_LIST } from '../graphql/community';
import { getCommunityId, sendPendoEvent } from '@teamhub/api';
import { useQuery } from '@teamhub/apollo-config';
import EditableGroupList from './EditableGroupList';
import strings from '../constants/strings';
import { SearchBar } from './reusableComponents';

const Drawer = withStyles(() => ({
  paper: {
    width: '25%',
  },
}))(MuiDrawer);

const DrawerAction = withStyles((theme) => ({
  root: {
    backgroundColor: '#EDECFB',
    color: theme.palette.primary.main,
  },
  startIcon: {
    fontSize: '1rem',
  },
}))(Button);

const DrawerActionText = withStyles(() => ({
  root: {
    fontWeight: 500,
    fontSize: '0.75rem',
  },
}))(Typography);

const DrawerHeader = withStyles((theme) => ({
  root: {
    color: '#000',
    fontWeight: 500,
    lineHeight: `${theme.spacing(3)}px`,
    letter: '0.15px',
    flex: 1,
  },
}))(Box);

const DrawerForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function createGroupTemplate() {
  return {
    _id: null,
    name: '',
  };
}

export default function ManageGroupsDrawer({
  open,
  onClose,
  setResidentGroupDeleted,
}) {
  const [currentView, setCurrentView] = React.useState('GroupsList');
  const [searchField, setSearchField] = React.useState('');
  const [newGroups, setNewGroups] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [filteredGroups, setFilteredGroups] = React.useState([]);
  const [isEditting, setIsEditting] = React.useState(false);

  const communityId = getCommunityId();

  const { data, loading, refetch: refetchGroups } = useQuery(
    RESIDENT_GROUPS_LIST,
    {
      nextFetchPolicy: 'network-only',
      variables: {
        communityId,
      },
    },
  );

  React.useEffect(() => {
    if (!loading) {
      const groupsList = data.community.residentGroups.nodes;
      setGroups(groupsList);
    }
  }, [data, loading]);

  function removeNewGroupByIndex(index) {
    setNewGroups(newGroups.filter((_, idx) => idx !== index));
  }

  function handleNew() {
    setIsEditting(true);

    sendPendoEvent(strings.PendoEvents.groups.add);
    setNewGroups([createGroupTemplate(), ...newGroups]);
  }

  function handleSearchChange(value) {
    setSearchField(value);
    sendPendoEvent(strings.PendoEvents.groups.directorySearch);
  }

  function handleClose() {
    setIsEditting(false);
    setNewGroups([]);
    onClose();
  }

  React.useEffect(() => {
    if (searchField.length) {
      setFilteredGroups(
        groups.filter((group) =>
          group.name
            .replace(' ', '')
            .toLowerCase()
            .includes(searchField.replace(' ', '').toLowerCase()),
        ),
      );
    }
  }, [searchField]);

  React.useEffect(() => {
    if (
      currentView == 'GroupsList' &&
      !newGroups.length &&
      !groups.length &&
      !loading
    ) {
      setCurrentView('EmptyState');
    } else if ((groups.length || newGroups.length) && !loading) {
      setFilteredGroups(groups);
      setCurrentView('GroupsList');
    }
  }, [groups, newGroups, currentView]);

  function getView() {
    switch (currentView) {
      case 'EmptyState':
        return <GroupsDrawerEmptyState />;
      case 'GroupsList':
        return (
          <EditableGroupList
            open={open}
            groups={groups}
            filteredGroups={filteredGroups}
            searchField={searchField}
            newGroups={newGroups}
            onClose={handleClose}
            refetchGroups={refetchGroups}
            removeNewGroupByIndex={removeNewGroupByIndex}
            setIsEditting={setIsEditting}
            isEditting={isEditting}
            setResidentGroupDeleted={setResidentGroupDeleted}
          />
        );
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <DrawerForm>
        <Box padding={2.5} display="flex" alignItems="center">
          <DrawerHeader>Manage Groups</DrawerHeader>
          <DrawerAction onClick={handleNew} disabled={isEditting}>
            <DrawerActionText variant="body1">Add</DrawerActionText>
          </DrawerAction>
        </Box>
        <Box paddingX={2.5} display="flex" alignItems="center">
          <IconButton type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <SearchBar
            placeholder="Search Resident Groups"
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search resident groups' }}
            value={searchField}
            showSearchIcon={false}
            style={{ width: '100%' }}
            inputStyle={{ fontSize: '14px' }}
            disableUnderline
          />
        </Box>
        <Divider />

        <Box flex={1} overflow="auto">
          <List component="nav" aria-label="secondary mailbox folders">
            {getView()}
          </List>
        </Box>
      </DrawerForm>
    </Drawer>
  );
}
