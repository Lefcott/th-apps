/** @format */

import React from 'react';
import { get } from 'lodash';
import {
  Box,
  Button,
  ListItem,
  ListItemText,
  IconButton,
  Popover,
  Typography,
} from '@material-ui/core';
import { FormTextfield } from '../utils/formComponents';
import strings from '../constants/strings';
import { getCommunityId, sendPendoEvent } from '@teamhub/api';
import { makeStyles, withStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faCheck,
  faTimes,
  faTrash,
  faEdit,
} from '@fortawesome/pro-regular-svg-icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useMutation } from '@teamhub/apollo-config';
import {
  CREATE_RESIDENT_GROUP,
  REMOVE_RESIDENT_GROUP,
  UPDATE_RESIDENT_GROUP,
} from '../graphql/community';
import { showToast } from '@teamhub/toast';
import EditableGroupListItemDialog from './EditableGroupListItemDialog';

const useStyles = makeStyles(() => ({
  root: {
    background: (props) => (props.new ? 'rgba(237, 236, 251, 0.5)' : '#fff'),
  },
  groupNameContainer: {
    width: '90%',
  },
  groupName: {
    inlineSize: '100%',
    overflowWrap: 'break-word',
  },
}));

const PaddedButton = withStyles((theme) => ({
  root: {
    marginLeft: '0.5rem',
    padding: theme.spacing(0.5),
    minWidth: 0,
    fontSize: '12px',
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}))(Button);

const GroupNameTextField = withStyles((theme) => ({
  root: {
    maxWidth: '200px',
    marginLeft: theme.spacing(2),
  },
}))(FormTextfield);

const IconButtonBox = withStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '18px auto',
    gridGap: '12px',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))(Box);

export default function EditableGroupListItem({
  index,
  names,
  group,
  groups,
  refetchGroups,
  setFormState,
  setFormName,
  onClose,
  removeNewGroupByIndex,
  setIsEditting,
  isEditting,
  setResidentGroupDeleted,
}) {
  const classes = useStyles({
    new: !group._id,
  });

  const ViewState = {
    FORM_NORMAL: 'FormNormal',
    FORM_EDIT: 'FormEdit',
  };

  const [anchorEl, setAnchorEl] = React.useState(null); // used to determine where to render the options panel
  const [viewState, setViewState] = React.useState(ViewState.FORM_NORMAL); // sets the view of a row as in edition or as normal
  const [showConfirmationModal, setShowConfirmationModal] = React.useState(
    false,
  );
  const openMenu = Boolean(anchorEl);
  const minCharacters = 3;
  const maxCharacters = 70;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(
        minCharacters,
        strings.Validation.minCharacters('Group name', minCharacters),
      )
      .max(
        maxCharacters,
        strings.Validation.maxCharacters('Group name', maxCharacters),
      )
      .required(strings.ResidentGroup.create.enter('Group name'))
      .test(
        'uniqueName',
        strings.ResidentGroup.create.exists('Group name'),
        function (value) {
          if (!value) {
            return true;
          }
          const { path } = this;
          const list = Object.entries(names);

          const exists = list.find(([guid, value]) => {
            const valueName =
              value !== '' && typeof value === 'string'
                ? value
                : value.name
                ? value.name
                : null;

            return (
              group._id &&
              guid !== (group._id || group.clientGuid) &&
              typeof formik.values.name === 'string' &&
              typeof valueName === 'string' &&
              formik.values.name.trim().toLowerCase() ===
                valueName.trim().toLowerCase()
            );
          });

          if (exists && formik.dirty) {
            throw this.createError({
              path,
            });
          }

          return true;
        },
      ),
  });

  const communityId = getCommunityId();

  const initialValues = {
    name: get(group, 'name'),
  };

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
  });

  React.useEffect(() => {
    if (group._id) {
      setFormState(group._id, formik.dirty);
    }
  }, [formik.dirty]);

  React.useEffect(() => {
    setFormName(group._id, formik.values.name);
  }, [formik.values.name]);

  React.useEffect(() => {
    setFormName(group._id, formik.values.name);
  }, []);

  React.useEffect(() => {
    if (!open) {
      formik.resetForm({
        initialValues,
        values: initialValues,
      });
    }
  });

  const [createGroup] = useMutation(CREATE_RESIDENT_GROUP, {
    async onCompleted(data) {
      removeNewGroupByIndex(index);
      if (!groups.length) {
        onClose();
      }
      await handleCompletedCreateMutation();

      // Reset form after creation so it's no longer dirty
      formik.resetForm({
        values: data?.community?.updateResidentGroup?.residentGroup,
      });
    },
    onError(err) {
      if (err.message.match('409')) {
        formik.setFieldError(
          'name',
          strings.ResidentGroup.create.exists('Group name'),
        );
      }
    },
  });

  const [updateGroup] = useMutation(UPDATE_RESIDENT_GROUP, {
    async onCompleted(data) {
      if (!groups.length) {
        onClose();
      }
      await handleCompletedEditMutation();

      // Reset form after edition so it's no longer dirty
      formik.resetForm({
        values: data?.community?.updateResidentGroup?.residentGroup,
      });
    },
    onError(err) {
      if (err.message.match('409')) {
        formik.setFieldError(
          'name',
          strings.ResidentGroup.create.exists('Group name'),
        );
      }
    },
  });

  const [removeResidentGroup] = useMutation(REMOVE_RESIDENT_GROUP, {
    async onCompleted() {
      await handleCompletedDeleteMutation();
    },
    onError(err) {
      console.log(err);
    },
  });

  // Shows the toast with the message and set the view state back to normal after edition is complete
  const showToastAndResetView = async () => {
    showToast(strings.Component.created('group'));
    await refetchGroups();

    setIsEditting(false);
    setViewState(ViewState.FORM_NORMAL);
  };

  async function handleCompletedCreateMutation() {
    showToast(strings.Component.created('group'));
    sendPendoEvent(strings.PendoEvents.groups.addSave);
    await refetchGroups();

    setIsEditting(false);
  }

  async function handleCompletedEditMutation() {
    showToastAndResetView();
    sendPendoEvent(strings.PendoEvents.groups.directoryEditSave);
  }

  async function handleCompletedDeleteMutation() {
    showToastAndResetView();
    sendPendoEvent(strings.PendoEvents.groups.directoryDeleteConfirm);

    setResidentGroupDeleted(true);
  }

  async function onSubmit(values) {
    const { name } = values;

    if (group._id) {
      await updateGroup({
        variables: {
          communityId,
          input: {
            name,
            groupId: group._id,
          },
        },
      });
    } else {
      await createGroup({
        variables: {
          communityId,
          input: {
            name,
          },
        },
      });
    }
  }

  const hasError = (field) =>
    Boolean(formik.errors[field] && formik.touched[field]);
  const fieldErrors = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';

  async function handleSubmit(values) {
    formik.handleSubmit(values);
  }

  function handleCancel() {
    if (!group._id) {
      removeNewGroupByIndex(index);
    } else {
      formik.resetForm({
        values: formik.initialValues,
      });
    }
    sendPendoEvent(strings.PendoEvents.groups.directoryEditCancel);
    setViewState(ViewState.FORM_NORMAL);
    setIsEditting(false);
    setAnchorEl(null);
  }

  const handleClickEdit = React.useCallback((values) => {
    setViewState(ViewState.FORM_EDIT);
    setIsEditting(true);
    setAnchorEl(null);
  }, []);

  function handleClickDelete() {
    setAnchorEl(null);
    setShowConfirmationModal(true);
    sendPendoEvent(strings.PendoEvents.groups.directoryDelete);
  }

  async function handleConfirmDelete() {
    setShowConfirmationModal(false);

    await removeResidentGroup({
      variables: {
        communityId,
        input: {
          groupId: group._id,
        },
      },
    });
  }

  function handleCancelDelete() {
    setShowConfirmationModal(false);
    sendPendoEvent(strings.PendoEvents.groups.directoryDeleteCancel);
  }

  const handleClickMore = React.useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      pl={3}
      pb={0.5}
      pr={1.5}
      flex={1}
      display="flex"
      flexDirection="column"
      borderBottom="1px solid rgba(229, 229, 229, 1)"
    >
      <Box
        mt={1}
        mx={0}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box className={classes.groupNameContainer}>
          {group._id ? (
            viewState === ViewState.FORM_NORMAL ? (
              <ListItem>
                <ListItemText
                  className={classes.groupName}
                  primary={formik.values.name}
                />
              </ListItem>
            ) : (
              <GroupNameTextField
                id="name"
                name="name"
                fullWidth={false}
                onChange={formik.handleChange}
                onKeyPress={handleKeyPress}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={hasError('name')}
                helperText={fieldErrors('name')}
              />
            )
          ) : (
            <GroupNameTextField
              id="name"
              name="name"
              fullWidth={false}
              onChange={formik.handleChange}
              onKeyPress={handleKeyPress}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={hasError('name')}
              helperText={fieldErrors('name')}
            />
          )}
        </Box>
        <Box>
          {group._id && (
            <Box marginLeft="auto">
              {viewState !== ViewState.FORM_EDIT && (
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClickMore}
                  disabled={isEditting}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </IconButton>
              )}
              {
                <Popover
                  id="RD_resident-group-more-menu"
                  open={openMenu}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Box display="flex" flexDirection="column" py={0.5}>
                    <IconButtonBox onClick={handleClickEdit}>
                      <Box>
                        <FontAwesomeIcon icon={faEdit} fontWeight="bold" />
                      </Box>
                      <Typography variant="caption">Edit</Typography>
                    </IconButtonBox>

                    <IconButtonBox color="#C62828" onClick={handleClickDelete}>
                      <Box>
                        <FontAwesomeIcon icon={faTrash} fontWeight="bold" />
                      </Box>
                      <Typography variant="caption">Delete</Typography>
                    </IconButtonBox>
                  </Box>
                </Popover>
              }
            </Box>
          )}

          {(viewState === ViewState.FORM_EDIT ||
            formik.dirty ||
            !group._id) && (
            <Box marginLeft="auto">
              <PaddedButton
                size="small"
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                <FontAwesomeIcon icon={faCheck} />
              </PaddedButton>
              <PaddedButton
                onClick={handleCancel}
                size="small"
                variant="contained"
              >
                <FontAwesomeIcon icon={faTimes} />
              </PaddedButton>
            </Box>
          )}
        </Box>
      </Box>
      <EditableGroupListItemDialog
        handleSubmit={handleConfirmDelete}
        handleClose={handleCancelDelete}
        isOpen={showConfirmationModal}
      />
    </Box>
  );
}
