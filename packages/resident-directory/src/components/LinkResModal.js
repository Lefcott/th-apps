/** @format */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { isNull, filter, concat, get } from 'lodash';
import link from '../assets/images/link.svg';
import { showToast, showErrorToast } from '@teamhub/toast';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Typography,
  useMediaQuery,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useLazyQuery, useMutation } from '@teamhub/apollo-config';
import {
  GET_RESIDENT,
  GET_LINKED_RESIDENTS,
  MERGE_CONTACTS,
  GET_CONTACTS,
} from '../graphql/users';
import { getCommunityId } from '@teamhub/api';
import { ResidentAvatar } from './ListItem';
import { useDebounce } from 'use-debounce';
import strings from '../constants/strings';

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => (props.isTitle ? '20px' : '4px 0')};
`;

const HelperIcon = styled(HelpOutline)`
  && {
    width: 16px;
    font-size: 16px;
    margin-left: 5px;
    :hover {
      color: #4c43db;
    }
  }
`;

const ListWrapper = styled(List)`
  && {
    border-radius: 6px;
    border: solid 1px rgba(0, 0, 0, 0.2);
    margin: 25px 0;
  }
`;

const ActionButton = styled(Button)`
  && {
    font-weight: 600;
  }
`;

const LinkContainer = styled.div`
  position: absolute;
  top: 0;
  right: 45%;
  width: 30px;
  height: 30px;
  border: solid 1px #cccccc;
  border-radius: 50%;
  background-color: #ffffff;
`;

function LinkResModal(props) {
  const { closeModal, resident, updateLinked } = props;

  const [mergeContacts] = useMutation(MERGE_CONTACTS);
  const isMobile = useMediaQuery('(max-width:960px)');
  const communityId = getCommunityId();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [linkedResident, setLinkedResident] = useState(null);

  const [getContacts, { loading: loadingContacts, data }] = useLazyQuery(
    GET_CONTACTS,
  );
  const [
    getLinkedResidents,
    { data: communityResidents, loading, error },
  ] = useLazyQuery(GET_LINKED_RESIDENTS, {
    variables: { communityId },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (search) {
      (async () => {
        await getLinkedResidents({
          variables: { communityId, filters: { search } },
        });
      })();
    }
  }, [debouncedSearch]);
  useEffect(() => {
    if (linkedResident) {
      getContacts({ variables: { residentId: linkedResident._id } });
    }
  }, [linkedResident]);

  const onLinkClick = () => {
    const linkedContacts = get(data, 'resident.contacts', []);
    mergeContacts({
      variables: {
        communityId,
        residentId: resident._id,
        mergeResidentId: linkedResident._id,
      },
      update(cache) {
        const variables = { id: get(resident, '_id'), communityId };
        const cachedResident = cache.readQuery({
          query: GET_RESIDENT,
          variables: variables,
        });

        const resCopy = {
          ...cachedResident,
          contacts: [...cachedResident.resident.contacts, ...linkedContacts],
        };

        cache.writeQuery({
          variables: variables,
          query: GET_RESIDENT,
          data: resCopy,
        });
      },
    })
      .then(() => {
        showToast(
          strings.Toasts.friendsAndFamilyAdded(
            resident.fullName,
            linkedResident.fullName,
            linkedContacts.length,
          ),
        );
        const mergedContacts = concat(resident.contacts, linkedContacts);
        updateLinked(linkedResident, mergedContacts);
        closeModal();
      })
      .catch((err) => {
        showErrorToast();
        console.warn(err);
      });
  };

  const residents = filter(
    get(communityResidents, 'community.residents', []),
    (res) => res._id !== resident._id,
  );

  // parse out the data from linkedContacts
  const linkedContacts = get(data, 'resident.contacts', []);
  return (
    <Dialog open={true} fullScreen={isMobile} id="Rm_linkFamilyModal">
      <Header isTitle>
        <Typography variant="h5">
          {strings.Form.dialog.linkResidentsTitle}
        </Typography>
        <Tooltip
          disableFocusListener
          disableTouchListener
          placement="top"
          title={
            <div style={{ display: 'grid' }}>
              <span>Linked residents will share all</span>
              <span>friends and family contacts.</span>
            </div>
          }
        >
          <HelperIcon />
        </Tooltip>
      </Header>
      <DialogContent style={{ maxWidth: 325 }}>
        <Typography variant="body1">
          {strings.Form.dialog.unlinkWarning}
        </Typography>
        <ListWrapper>
          <ListItem>
            <ListItemAvatar>
              <ResidentAvatar resident={resident} />
            </ListItemAvatar>
            <div>
              <Typography variant="caption" color="textSecondary">
                Resident
              </Typography>
              <Typography variant="body1">{resident.fullName}</Typography>
            </div>
          </ListItem>

          <div style={{ position: 'relative', padding: '15px 0' }}>
            <Divider />
            <LinkContainer>
              <img src={link} alt="link" style={{ width: 15, padding: 7 }} />
            </LinkContainer>
          </div>

          <ListItem>
            <ListItemAvatar>
              <ResidentAvatar resident={linkedResident} />
            </ListItemAvatar>
            <Autocomplete
              id="Rm_linkModal-dropdown"
              options={
                debouncedSearch.length > 0
                  ? filter(residents, (res) => isNull(res.linkedResident))
                  : []
              }
              getOptionLabel={(res) => res.fullName}
              value={linkedResident}
              onChange={(_, value) => {
                setSearch(value.fullName);
                setLinkedResident(value);
              }}
              style={{ width: '100%' }}
              loading={loading}
              clearOnBlur={false}
              noOptionsText={
                debouncedSearch.length > 0
                  ? strings.Form.dialog.noResidentFound
                  : strings.Form.dialog.residentSearch
              }
              disableClearable
              onInputChange={(_, value) => setSearch(value)}
              loadingText="Loading residents..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Resident"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </ListItem>

          {linkedContacts.length > 0 && !loadingContacts && (
            <div style={{ padding: '8px 16px' }}>
              <Header>
                <Typography variant="subtitle2">
                  {`${linkedResident.firstName}’s ` +
                    `${strings.FriendsAndFamily.contactsAmount(
                      linkedContacts.length || 0,
                    )}`}
                </Typography>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  placement="top"
                  title={
                    <div style={{ display: 'grid' }}>
                      <span>Friends and family will be invited to the app</span>
                      <span>if they don’t currently have access.</span>
                    </div>
                  }
                >
                  <HelperIcon />
                </Tooltip>
              </Header>
              <div style={{ maxHeight: 130, overflow: 'auto' }}>
                {linkedContacts.map((contact) => (
                  <ListItem key={contact._id} style={{ padding: '4px 0' }}>
                    <ListItemText
                      primary={contact.fullName}
                      secondary={contact.relationship}
                    />
                  </ListItem>
                ))}
              </div>
            </div>
          )}
        </ListWrapper>
      </DialogContent>
      <DialogActions>
        <ActionButton id="Rm_linkModal-cancel" onClick={() => closeModal()}>
          {strings.Card.button.cancel}
        </ActionButton>
        <ActionButton
          id="Rm_linkModal-submit"
          color="primary"
          disabled={isNull(linkedResident)}
          onClick={onLinkClick}
        >
          {strings.Card.button.linkResident}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}

export default LinkResModal;
