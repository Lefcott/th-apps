/** @format */

import React from 'react';
import {
  FormDropdown,
  FormTextfield,
  FormDatePicker,
} from '../utils/formComponents';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  useMediaQuery,
} from '@material-ui/core';
import { Event } from '@material-ui/icons';
import { useMutation } from '@teamhub/apollo-config';
import { INITIATE_RESIDENT_MOVE } from '../graphql/support';
import { GET_RESIDENT } from '../graphql/users';
import { pickBy } from 'lodash';
import { showToast, showErrorToast } from '@teamhub/toast';
import * as Yup from 'yup';
import strings from '../constants/strings';

const REASONS = [
  'Change unit',
  'Deceased',
  'Higher level of care',
  'Improved health',
  'Moved in with family',
  'Moved to another community',
  'Other',
];

const TYPES = [
  { text: 'Move Room', value: 'Move' },
  { text: 'Move Out', value: 'Move_Out' },
];

const moveSchema = Yup.object().shape({
  reason: Yup.string().min(1).required(),
  address: Yup.string().nullable(),
  newAddress: Yup.string().when('moveType', (moveType, schema) => {
    if (moveType === 'Move') {
      return schema.required().min(1);
    }
  }),
  moveDate: Yup.date().required(),
  notes: Yup.string(),
  moveType: Yup.string().required(),
});

export default function MoveResident(props) {
  const fullScreen = useMediaQuery('(max-width:960px)');
  const { open, close, resident, communityId } = props;
  const [moveResident] = useMutation(INITIATE_RESIDENT_MOVE, {
    onCompleted: () => {
      showToast(strings.Toasts.changesSubmitted);
    },
  });

  function submitRoomMove(values, { setSubmitting }) {
    moveResident({
      variables: {
        residentId: resident._id,
        communityId,
        moveInfo: pickBy({
          moveType: values.moveType,
          reason: values.reason,
          newAddress: values.newAddress,
          moveDate: values.moveDate.toString(),
        }),
      },
      // since the cache doesn't automatically update here, we need to do it ourselves
      // we want "Move Pending" to appear on the list item, so we add a "moveRoomPending" property
      // to the resident
      update(cache, response) {
        const data = cache.readQuery({
          query: GET_RESIDENT,
          variables: { id: resident._id, communityId },
        });
        cache.writeQuery({
          query: GET_RESIDENT,
          data: {
            ...data,
            resident: { ...data.resident, moveRoomPending: true },
          },
        });
      },
    })
      .then(() => {
        setSubmitting(false);
        close();
      })
      .catch((err) => {
        showErrorToast();
        setSubmitting(false);
        close();
      });
  }

  function validateForm({ errors, handleSubmit }) {
    if (isEmpty(errors)) {
      return handleSubmit();
    }

    console.warn('There are form errors: ', errors);
  }

  let style = fullScreen ? null : { minWidth: '960px', minHeight: '474px' };
  return (
    <Dialog
      open={open}
      onClose={close}
      fullScreen={fullScreen}
      PaperProps={{ style: style }}
    >
      <DialogTitle>Resident Move</DialogTitle>
      <Formik
        initialValues={{
          reason: '',
          address: props.resident.address,
          newAddress: '',
          moveDate: new Date(),
          notes: '',
          moveType: '',
        }}
        enableReinitialize
        validationSchema={moveSchema}
        onSubmit={submitRoomMove}
      >
        {(formProps) => (
          <>
            <DialogContent>
              <FormDropdown
                name="moveType"
                label="Type of Move"
                required
                error={formProps.errors.moveType}
                margin="dense"
                value={formProps.values.moveType}
                onChange={formProps.handleChange}
              >
                <MenuItem value="" disabled>
                  - select -
                </MenuItem>
                {TYPES.map((type, i) => (
                  <MenuItem key={i} value={type.value}>
                    {type.text}
                  </MenuItem>
                ))}
              </FormDropdown>
              <FormDropdown
                name="reason"
                label="Reason"
                required
                margin="dense"
                error={formProps.errors.reason}
                value={formProps.values.reason}
                onChange={formProps.handleChange}
              >
                <MenuItem value="" disabled>
                  - select -
                </MenuItem>
                {REASONS.map((reason, i) => (
                  <MenuItem key={i} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </FormDropdown>
              <MoveRoomFormContents {...formProps} />
            </DialogContent>
            <DialogActions>
              <Button onClick={close}>{strings.Card.button.cancel}</Button>
              <Button
                id="Rm_Move-save"
                color="primary"
                onClick={() => validateForm(formProps)}
              >
                {strings.Card.button.save}
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}

function MoveRoomFormContents(props) {
  const { moveType, address, newAddress, moveDate, notes } = props.values;
  const { handleChange, errors } = props;

  function changeDate(date) {
    return props.setFieldValue('moveDate', date);
  }
  if (moveType === 'Move') {
    return (
      <>
        <FormTextfield
          name="address"
          label="Current Address"
          disabled
          margin="dense"
          value={address}
        />
        <FormTextfield
          name="newAddress"
          label="New Address"
          margin="dense"
          required
          error={errors.newAddress}
          value={newAddress}
          onChange={handleChange}
        />
        <FormDatePicker
          name="moveDate"
          label="Move Date"
          margin="dense"
          error={errors.moveDate}
          required
          iconbutton={<Event />}
          value={moveDate}
          onChange={changeDate}
        />
        <FormTextfield
          name="notes"
          label="Notes"
          margin="dense"
          error={errors.notes}
          multiline
          rows={3}
          value={notes}
          onChange={handleChange}
        />
      </>
    );
  }

  return (
    <FormDatePicker
      name="moveDate"
      label="Date"
      margin="dense"
      required
      error={errors.moveDate}
      iconbutton={<Event />}
      value={moveDate}
      onChange={changeDate}
    />
  );
}
