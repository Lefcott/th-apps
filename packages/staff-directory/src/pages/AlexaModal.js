/** @format */

import React from 'react';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { showToast, showErrorToast } from '@teamhub/toast';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory, useParams } from 'react-router-dom';
import { get } from 'lodash';
import { getCommunityId, sendPendoEvent } from '@teamhub/api';

import AlexaContactForm, { FormAction } from '../components/AlexaContactForm';
import PageLoader from '../components/PageLoader';
import {
  CREATE_COMMUNITY_ALEXA_CONTACT,
  REMOVE_COMMUNITY_ALEXA_CONTACT,
  GET_COMMUNITY_ADDRESS_BOOK,
} from '../graphql/address-book.js';

const useDialogStyles = makeStyles((theme) => ({
  root: {
    zIndex: '9998',
  },

  paper: {
    minHeight: ({ maxLimitReached }) => (maxLimitReached ? 200 : 310),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      margin: 0,
    },
  },
}));

export default function AlexaModal(props) {
  const history = useHistory();
  const params = useParams();
  const communityId = getCommunityId();

  const [createContact] = useMutation(CREATE_COMMUNITY_ALEXA_CONTACT, {
    onCompleted() {
      switch (action) {
        case FormAction.ADD:
          return sendPendoEvent('alexa_contact_created', null);
        case FormAction.EDIT:
          return sendPendoEvent('alexa_contact_updated', null);
      }
    },
  });
  const [removeContact] = useMutation(REMOVE_COMMUNITY_ALEXA_CONTACT);
  const { data, loading } = useQuery(GET_COMMUNITY_ADDRESS_BOOK, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      communityId,
    },
  });

  const contacts = data?.community?.alexaAddressBook?.contacts || [];
  const contactIndex = params.id !== 'new' ? parseInt(params.id) : null;
  const contact = contacts[contactIndex];

  const action = params.id !== 'new' ? FormAction.EDIT : FormAction.ADD;

  const maxLimitReached = contacts.length >= 10 && action === FormAction.ADD;

  const dialogClasses = useDialogStyles({ maxLimitReached });
  function goToManagement(state = null) {
    history.push({
      pathname: '/alexa',
      search: history.location.search,
      state,
    });
  }

  async function onSubmit(values) {
    const { name, phoneNumber } = values;

    try {
      if (params.id !== 'new') {
        await removeContact({
          variables: {
            communityId,
            input: {
              contactName: contact.name,
            },
          },
        });
      }

      await createContact({
        variables: {
          communityId,
          input: {
            contacts: [
              {
                name,
                phoneNumbers: [phoneNumber],
              },
            ],
          },
        },
      });

      const text =
        action === FormAction.ADD
          ? `${name} added to directory.`
          : `${name} has been updated.`;
      showToast(text);

      goToManagement({ refetch: true });
    } catch ({ graphQLErrors, ...errors }) {
      showErrorToast();
      return graphQLErrors;
    }
  }

  function onCancel() {
    goToManagement();
  }

  const initialValues = {
    name: get(contact, 'name', ''),
    phoneNumber: get(contact, 'phoneNumbers[0]'),
  };

  return (
    <Dialog
      fullWidth
      fullScreen={useMediaQuery('(max-width:960px)')}
      open={true}
      maxWidth="sm"
      classes={dialogClasses}
      onBackdropClick={goToManagement}
    >
      {loading ? (
        <PageLoader size="md" />
      ) : (
        <AlexaContactForm
          action={action}
          onSubmit={onSubmit}
          onCancel={onCancel}
          data={initialValues}
          contacts={contacts}
          index={contactIndex}
          maxLimitReached={maxLimitReached}
        />
      )}
    </Dialog>
  );
}
