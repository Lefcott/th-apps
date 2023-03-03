/** @format */

import React from 'react';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import {
  GET_STAFF_MEMBER,
  UPDATE_STAFF_MEMBER,
  ADD_STAFF_MEMBER,
  SET_PROFILE_IMAGE,
  RESET_STAFF_PASSWORD,
} from '../graphql/users.js';
import { showToast, showErrorToast } from '@teamhub/toast';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory, useParams } from 'react-router-dom';
import { get, isEmpty, isBoolean, omit } from 'lodash';
import { getCommunityId } from '@teamhub/api';
import strings from '../constants/strings';
import StaffMemberForm, { FormAction } from '../components/StaffMemberForm';
import PageLoader from '../components/PageLoader';

const useDialogStyles = makeStyles((theme) => ({
  root: {
    zIndex: '9998',
  },

  paper: {
    minHeight: theme.spacing(55),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      margin: 0,
    },
  },
}));

export default function StaffModal() {
  const dialogClasses = useDialogStyles();

  const history = useHistory();
  const params = useParams();
  const staffId = params.id !== 'new' ? params.id : null;
  const action = staffId ? FormAction.EDIT : FormAction.ADD;
  const communityId = getCommunityId();
  const { data, loading } = useQuery(GET_STAFF_MEMBER, {
    variables: {
      staffId,
      communityId,
    },
    skip: action === FormAction.ADD,
  });

  const [editStaffMember] = useMutation(UPDATE_STAFF_MEMBER);
  const [setProfileImage] = useMutation(SET_PROFILE_IMAGE);
  const [addStaffMember] = useMutation(ADD_STAFF_MEMBER);
  const [resetPassword] = useMutation(RESET_STAFF_PASSWORD, {
    onCompleted() {
      showToast(strings.emailReset);
    },
  });

  function transformInputs({ sendPasswordResetEmail, staff }) {
    const inputs = { ...staff };

    const deletions = Object.entries(inputs).reduce(
      (deletions, [key, value]) => {
        if (isEmpty(value) && key !== 'file' && !isBoolean(value)) {
          deletions.push(key);
          delete inputs[key];
        }
        return deletions;
      },
      [],
    );

    return {
      sendPasswordResetEmail,
      deletions,
      inputs: omit(inputs, ['profileImage']),
    };
  }

  function goToManagement(state = null) {
    history.push({
      pathname: '/staff',
      search: history.location.search,
      state,
    });
  }

  async function onSubmit(values) {
    // don't send back file or profile image, as those are handling by other mutations
    const { sendPasswordResetEmail, inputs, deletions } = transformInputs(
      omit(values),
    );

    let localStaffId = staffId;
    try {
      switch (action) {
        case FormAction.ADD:
          const { data } = await addStaffMember({
            variables: {
              communityId,
              sendPasswordResetEmail,
              newStaffInput: inputs,
            },
          });
          localStaffId = data.community.addStaff._id;
          break;
        case FormAction.EDIT:
          await editStaffMember({
            variables: {
              communityId,
              staffId,
              sendPasswordResetEmail,
              edits: inputs,
              deletions: deletions,
            },
          });
          break;
      }

      if (values.file) {
        await setProfileImage({
          variables: {
            communityId,
            staffId: localStaffId,
            file: values.file,
          },
        });
      }

      const fullName = `${values.staff.firstName} ${values.staff.lastName}`;
      const text =
        action === FormAction.ADD
          ? `${fullName} added to directory.`
          : `${fullName} has been updated.`;
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

  function onResetPassword() {
    resetPassword({
      variables: {
        communityId,
        staffId,
      },
    });
  }

  function getProfileImage(profileImage) {
    if (profileImage) {
      return profileImage.includes('misc/profile.svg') ? null : profileImage;
    }
  }

  const initialValues = {
    sendPasswordResetEmail: action === FormAction.ADD,
    staff: {
      firstName: get(data, 'staff.firstName', ''),
      lastName: get(data, 'staff.lastName', ''),
      email: get(data, 'staff.email', ''),
      jobTitle: get(data, 'staff.jobTitle', ''),
      primaryPhone: get(data, 'staff.primaryPhone', ''),
      secondaryPhone: get(data, 'staff.secondaryPhone', ''),
      department: get(data, 'staff.department', ''),
      profileImage: getProfileImage(get(data, 'staff.profileImage', null)),
      publicProfile: get(data, 'staff.publicProfile', true),
      visibleEmail: get(data, 'staff.visibleEmail', true),
      visiblePhone: get(data, 'staff.visiblePhone', true),
    },
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
        <StaffMemberForm
          action={action}
          onSubmit={onSubmit}
          onCancel={onCancel}
          data={initialValues}
          onResetPassword={onResetPassword}
        />
      )}
    </Dialog>
  );
}
