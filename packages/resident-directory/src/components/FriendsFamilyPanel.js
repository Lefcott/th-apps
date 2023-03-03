/** @format */

import React, { useState } from 'react';
import { isEqual, isNull, isEmpty, get } from 'lodash';
import { People, MoreVert } from '@material-ui/icons';
import {
  Grid,
  Button,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@material-ui/core';
import { IconDropdown } from './reusableComponents';
import {
  contactListOptions,
  familyIntegrationEnabledOptions,
} from '../utils/componentData';
import AddFamilyForm from './AddFamilyForm';
import LinkResModal from './LinkResModal';
import GetAppCode from './GetAppCode';
import DeleteContactModal from './DeleteContactModal';
import PanelHeader from './PanelHeader';
import { useMutation } from '@teamhub/apollo-config';
import { StyledExpansionPanel } from '../utils/styledComponents';
import { getCommunityId } from '@teamhub/api';
import { showToast } from '@teamhub/toast';
import { INVITE_USER_WITH_EMAIL } from '../graphql/support';
import strings from '../constants/strings';

function FriendsFamilyPanel(props) {
  const {
    readOnly,
    expanded,
    resident,
    setFieldValue,
    familyIntegrationEnabled,
  } = props;
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const communityId = getCommunityId();
  const [selectedContact, setSelectedContact] = useState(null);
  const isNewResident = isEqual(resident._id, 'new');
  const [resendInviteByEmail] = useMutation(INVITE_USER_WITH_EMAIL);

  const resendInvite = async (contact) => {
    try {
      await resendInviteByEmail({
        variables: {
          communityId: getCommunityId(),
          userId: get(contact, '_id'),
          fromResident: get(resident, '_id'),
        },
      });
      showToast(strings.Toasts.reInvite(contact.fullName));
    } catch (err) {
      console.warn(err);
    }
  };

  const onContactOptionClick = (option, contact) => {
    setSelectedContact(contact);
    switch (option) {
      case 'edit':
        return setContactModalOpen(true);
      case 'code':
        return setCodeModalOpen(true);
      case 'invite':
        return resendInvite(contact);
      case 'delete':
        return setDeleteModalOpen(true);
      default:
        return;
    }
  };

  const filteredContactListOptions = familyIntegrationEnabled
    ? familyIntegrationEnabledOptions
    : contactListOptions;

  return (
    <>
      <StyledExpansionPanel
        id="Rm_Panel-family"
        expanded={expanded}
        onChange={props.activatePanel}
        summary={
          <PanelHeader icon={People} label={strings.FriendsAndFamily.title} />
        }
        details={
          isNewResident ? (
            <span>{strings.FriendsAndFamily.saveMessage}</span>
          ) : (
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  {strings.FriendsAndFamily.text(resident.firstName)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="subtitle2">
                    {strings.FriendsAndFamily.linkedResident}
                  </Typography>
                  {isNull(resident.linkedResident) ? (
                    <Button
                      id="Rm_familyPanel-link"
                      color="primary"
                      disabled={readOnly || familyIntegrationEnabled}
                      onClick={() => setLinkModalOpen(true)}
                    >
                      {strings.Card.button.linkResident}
                    </Button>
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      {strings.FriendsAndFamily.linkedResidentDeleteError}
                    </Typography>
                  )}
                </Grid>
                <Divider />
                <div style={{ padding: 15 }}>
                  <Typography
                    variant="body1"
                    color={
                      isNull(resident.linkedResident)
                        ? 'textSecondary'
                        : 'textPrimary'
                    }
                  >
                    {isNull(resident.linkedResident)
                      ? strings.FriendsAndFamily.noLinkedResident
                      : resident.linkedResident?.fullName}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="subtitle2">
                    {strings.FriendsAndFamily.contactsAmount(
                      resident?.contacts?.length
                    )}
                  </Typography>
                  {!familyIntegrationEnabled && (
                    <Button
                      id="Rm_familyPanel-add"
                      color="primary"
                      disabled={readOnly}
                      onClick={() => {
                        setSelectedContact(null);
                        setContactModalOpen(true);
                      }}
                    >
                      {strings.Card.button.addFriend}
                    </Button>
                  )}
                </Grid>
                <Divider />

                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {isEmpty(resident.contacts) ? (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ padding: 15 }}
                    >
                      {strings.FriendsAndFamily.noListedFriendsAndFamily}
                    </Typography>
                  ) : (
                    resident.contacts.map((contact) => (
                      <ListItem
                        className="Rm_familyPanel-contact"
                        key={contact._id}
                        divider
                        disabled={readOnly && !familyIntegrationEnabled}
                      >
                        <ListItemText
                          primary={contact?.fullName}
                          secondary={contact.relationship}
                        />
                        <IconDropdown
                          icon={<MoreVert />}
                          buttonprops={{
                            disabled: readOnly && !familyIntegrationEnabled,
                            className: 'Rm_familyPanel-contact-menu',
                          }}
                          menuItems={filteredContactListOptions}
                          itemOnClick={(option) =>
                            onContactOptionClick(option, contact)
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </div>
              </Grid>
            </Grid>
          )
        }
      />
      {codeModalOpen && (
        <GetAppCode
          open={true}
          residentId={selectedContact._id}
          residentFirstName={selectedContact.firstName}
          communityId={communityId}
          close={() => setCodeModalOpen(false)}
        />
      )}
      {contactModalOpen && (
        <AddFamilyForm
          closeModal={() => setContactModalOpen(false)}
          contact={selectedContact}
          resident={resident}
          refetchResident={props.refetchResident}
          updateContacts={(mergedContacts) =>
            setFieldValue('contacts', mergedContacts)
          }
        />
      )}
      {linkModalOpen && (
        <LinkResModal
          closeModal={() => setLinkModalOpen(false)}
          resident={resident}
          updateLinked={(linked, mergedContacts) => {
            setFieldValue('linkedResident', linked);
            setFieldValue('contacts', mergedContacts);
          }}
        />
      )}
      {deleteModalOpen && (
        <DeleteContactModal
          closeModal={() => setDeleteModalOpen(false)}
          contact={selectedContact}
          resident={resident}
          refetchResident={props.refetchResident}
          updateContacts={(contacts) => setFieldValue('contacts', contacts)}
        />
      )}
    </>
  );
}

FriendsFamilyPanel.defaultProps = {
  resident: {},
};

export default FriendsFamilyPanel;
