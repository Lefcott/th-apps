/** @format */

import React from 'react';
import styled from '@emotion/styled';
import { remove, isEqual } from 'lodash';
import { showToast, showErrorToast } from '@teamhub/toast';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { useMutation } from '@teamhub/apollo-config';
import { REMOVE_CONTACT } from '../graphql/users';
import { getCommunityId } from '@teamhub/api';
import strings from '../constants/strings';

const ActionButton = styled(Button)`
  && {
    font-weight: 600;
  }
`;

function DeleteContactModal(props) {
  const { closeModal, contact, resident, updateContacts } = props;
  const [submitting, setSubmitting] = React.useState(false);
  const [removeContact] = useMutation(REMOVE_CONTACT);
  const isMobile = useMediaQuery('(max-width:960px)');
  const communityId = getCommunityId();

  const onDeleteClick = async () => {
    setSubmitting(true);
    try {
      await removeContact({
        variables: {
          communityId,
          contactId: contact._id,
          residentId: resident._id,
        },
      });

      const updatedContacts = remove(
        // have to make a caopy of contacts, as resident.contacts is an immnutable apollo cache value
        [...resident.contacts],
        (item) => !isEqual(item._id, contact._id),
      );
      updateContacts(updatedContacts);

      await props.refetchResident();

      showToast(
        strings.Toasts.contactDeleted(resident.firstName, contact.fullName),
      );
      setSubmitting(false);
      closeModal();
    } catch (err) {
      setSubmitting(false);
      console.warn(err);
      showErrorToast();
    }
  };

  return (
    <Dialog open={true} fullScreen={isMobile}>
      <DialogTitle variant="h6">
        {strings.Form.dialog.deleteContactTitle(contact.firstName)}
      </DialogTitle>
      <DialogContent style={{ maxWidth: 325 }}>
        <DialogContentText>
          {strings.Form.dialog.deleteContactText(
            contact.firstName,
            resident.firstName,
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ActionButton id="Rm_deleteModal-cancel" onClick={closeModal}>
          {strings.Card.button.cancel}
        </ActionButton>
        <ActionButton
          id="Rm_deleteModal-submit"
          color="secondary"
          disabled={submitting}
          onClick={onDeleteClick}
        >
          {strings.Card.button.delete}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteContactModal;
