/** @format */

import React from 'react';
import { FormTextfield, PhoneMask } from '../utils/formComponents';
import { isNull, concat, omit, get, isNil } from 'lodash';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  ADD_CONTACT,
  ADD_CONTACTS_TO_PERSONAL_ADDRESS_BOOK,
  EDIT_CONTACT,
  INVITE_USER,
} from '../graphql/users';
import { useMutation } from '@teamhub/apollo-config';
import { getCommunityId, useFlags } from '@teamhub/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
  MenuItem,
  useMediaQuery,
  Switch,
  CircularProgress,
} from '@material-ui/core';
import { Switchlabel } from '../utils/styledComponents';
import { showToast, showErrorToast } from '@teamhub/toast';
import { validatePhone } from './ResidentCard';
import strings from '../constants/strings';

const contactSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(strings.Validation.enter('first name'))
    .trim(),
  lastName: Yup.string().required(strings.Validation.enter('last name')).trim(),
  email: Yup.string()
    .email()
    .required(strings.Validation.enter('valid email'))
    .trim(),
  relationship: Yup.string().required(
    strings.Validation.select('relationship'),
  ),
  primaryPhone: Yup.string()
    .test(
      'isValidPhoneNumber',
      strings.Validation.notValid('Phone number'),
      validatePhone,
    )
    .nullable()
    .trim(),
  registerPhoneNumberWithAlexa: Yup.boolean().default(false),
});

const initialNewMember = {
  firstName: '',
  lastName: '',
  email: '',
  relationship: '',
  primaryPhone: null,
  registerPhoneNumberWithAlexa: false,
};

const RELATIONSHIPS = [
  'Spouse',
  'Sibling',
  'Son',
  'Daughter',
  'Grandson',
  'Granddaughter',
  'Friend',
  'Other',
];

const ActionButton = styled(Button)`
  && {
    font-weight: 600;
  }
`;

export default function AddFamilyForm(props) {
  const { closeModal, resident, contact } = props;
  const isNewContact = isNull(contact);
  const isMobile = useMediaQuery('(max-width:960px)');
  const communityId = getCommunityId();
  const [editContact] = useMutation(EDIT_CONTACT);
  const [inviteUser] = useMutation(INVITE_USER);
  const [addAlexaContact] = useMutation(ADD_CONTACTS_TO_PERSONAL_ADDRESS_BOOK);
  const phoneNumberRegisteredWithAlexa = !!resident.alexaAddressBook?.contacts?.find(
    (alexaContact) =>
      !!alexaContact.phoneNumbers?.find(
        (phone) =>
          phone === contact?.primaryPhone &&
          alexaContact.name === contact.fullName,
      ),
  );
  const pstnLimitReached =
    resident.alexaAddressBook?.contacts.filter(
      (contact) => contact.type === 'pstn' || contact.type === 'reciprocal',
    ).length >= 10;

  const isAlexaCallingToggleDisabled = (props) => {
    return (
      !resident.alexaAddressBook ||
      (pstnLimitReached && !phoneNumberRegisteredWithAlexa) ||
      isNull(props.values.primaryPhone) ||
      props.errors.primaryPhone
    );
  };

  const shouldDisplayLimitReachedMessage =
    pstnLimitReached && !phoneNumberRegisteredWithAlexa;

  const flags = useFlags();
  const { 'alexa-calling': alexaCallingEnabled } = flags;

  const phoneOnChange = (e, setVal) => {
    let value = e.target.value;
    const field = e.target.name;
    value = value === '' ? null : value.replace(/-/g, '');
    setVal(field, value);
  };

  const hasError = ({ errors, touched }, field) =>
    errors[field] && touched[field];

  const submitForm = (values, { setSubmitting }) => {
    isNewContact
      ? addNewContact(values, setSubmitting)
      : editExistingContact(values, setSubmitting);
  };

  const [addContact] = useMutation(ADD_CONTACT);

  const addNewContact = (
    { registerPhoneNumberWithAlexa, ...newContact },
    setSubmitting,
  ) => {
    addContact({
      variables: {
        communityId,
        residentId: resident._id,
        newContact,
      },
    })
      .then(async ({ data }) => {
        const createdContact = data.community.resident.addContact;
        await inviteUser({
          variables: { communityId, id: createdContact._id },
        });

        if (
          registerPhoneNumberWithAlexa &&
          resident.rooms.length &&
          !isNil(createdContact.primaryPhone)
        ) {
          await addAlexaContact({
            variables: {
              communityId,
              input: {
                roomName: resident.rooms[0].name,
                contacts: [
                  {
                    name: `${createdContact.firstName} ${createdContact.lastName}`,
                    type: 'pstn',
                    phoneNumbers: [createdContact.primaryPhone],
                  },
                ],
              },
            },
          });
        }

        await props.refetchResident();

        showToast(strings.Toasts.invite(createdContact.fullName));
        setSubmitting(false);
        closeModal();
      })
      .catch((err) => {
        console.warn(err);
        showErrorToast();
        setSubmitting(false);
      });
  };

  const editExistingContact = (
    { registerPhoneNumberWithAlexa, ...contactData },
    setSubmitting,
  ) => {
    editContact({
      variables: {
        communityId,
        residentId: resident._id,
        contactId: contact._id,
        contact: omit(contactData, ['_id', '__typename', 'fullName']),
      },
    })
      .then(async () => {
        if (registerPhoneNumberWithAlexa && resident.rooms.length) {
          await addAlexaContact({
            variables: {
              communityId,
              input: {
                roomName: resident.rooms[0].name,
                contacts: [
                  {
                    name: `${contactData.firstName} ${contactData.lastName}`,
                    type: 'pstn',
                    phoneNumbers: [contactData.primaryPhone],
                  },
                ],
              },
            },
          });
        }

        await props.refetchResident();
        showToast(strings.Toasts.contactInformation(contactData.firstName));
        setSubmitting(false);
        closeModal();
      })
      .catch((err) => {
        console.warn(err);
        showErrorToast();
        setSubmitting(false);
      });
  };

  function getAlexaCallingHelperText(values) {
    if (!resident.alexaAddressBook) {
      return (
        <Grid item xs={12} sm={12}>
          <Switchlabel
            style={{
              color: 'rgba(158, 158, 158, 1)',
              margin: '0 0 16px 60px',
              display: 'block',
            }}
          >
            {strings.Alexa.device}
          </Switchlabel>
        </Grid>
      );
    }

    if (!values.primaryPhone) {
      return (
        <Grid item xs={12} sm={12}>
          <Switchlabel
            style={{
              color: 'rgba(158, 158, 158, 1)',
              margin: '0 0 16px 60px',
              display: 'block',
            }}
          >
            {strings.Alexa.calling}
          </Switchlabel>
        </Grid>
      );
    }

    if (shouldDisplayLimitReachedMessage) {
      return (
        <>
          <Grid item xs={12} sm={12}>
            <Switchlabel
              style={{
                color: 'rgba(158, 158, 158, 1)',
                margin: '0 0 0 60px',
                display: 'block',
              }}
            >
              {strings.Alexa.phoneNumbers}
            </Switchlabel>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Switchlabel
              style={{
                color: 'rgba(158, 158, 158, 1)',
                margin: '1rem 0 0 60px',
                display: 'block',
              }}
            >
              {strings.Alexa.disableAlexaCalling}
            </Switchlabel>
          </Grid>
        </>
      );
    }

    return (
      <Grid item xs={12} sm={12}>
        <Switchlabel
          style={{
            color: '#000000',
            margin: '0 0 0 60px',
            display: 'block',
          }}
        >
          {strings.Alexa.allowAlexaCalling}
        </Switchlabel>
      </Grid>
    );
  }

  return (
    <Formik
      initialValues={
        isNewContact
          ? initialNewMember
          : {
              ...contact,
              registerPhoneNumberWithAlexa: phoneNumberRegisteredWithAlexa,
            }
      }
      enableReinitialize
      validationSchema={contactSchema}
      onSubmit={submitForm}
    >
      {(props) => (
        <Dialog
          open={true}
          onClose={closeModal}
          fullScreen={isMobile}
          id="Rm_addFamilyModal"
        >
          <DialogTitle variant="h6">
            {isNewContact
              ? strings.Form.dialog.titleAddFamily
              : strings.Form.dialog.titleEditFamily}
          </DialogTitle>
          <DialogContent style={{ maxWidth: 450, paddingBottom: 20 }}>
            {isNewContact && (
              <DialogContentText>
                {strings.Form.dialog.invite}
              </DialogContentText>
            )}
            <Grid container spacing={3} style={{ paddingTop: 15 }}>
              <Grid item xs={12} sm={6}>
                <FormTextfield
                  required
                  name="firstName"
                  label="First Name"
                  onChange={props.handleChange}
                  value={props.values['firstName']}
                  error={hasError(props, 'firstName')}
                  helperText={
                    hasError(props, 'firstName') && props.errors['firstName']
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextfield
                  required
                  name="lastName"
                  label="Last Name"
                  onChange={props.handleChange}
                  value={props.values['lastName']}
                  error={hasError(props, 'lastName')}
                  helperText={
                    hasError(props, 'lastName') && props.errors['lastName']
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextfield
                  required
                  select
                  name="relationship"
                  label="Relationship"
                  onChange={props.handleChange}
                  value={props.values['relationship']}
                  error={hasError(props, 'relationship')}
                  helperText={
                    hasError(props, 'relationship') &&
                    props.errors['relationship']
                  }
                  style={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}
                >
                  <MenuItem value="" disabled>
                    - select -
                  </MenuItem>
                  {RELATIONSHIPS.map((relation, i) => (
                    <MenuItem key={i} value={relation}>
                      {relation}
                    </MenuItem>
                  ))}
                </FormTextfield>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ paddingTop: 30 }}>
              <Grid item xs={12} sm={6}>
                <FormTextfield
                  required
                  name="email"
                  label="Email"
                  onChange={props.handleChange}
                  value={props.values['email']}
                  error={hasError(props, 'email')}
                  helperText={hasError(props, 'email') && props.errors['email']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PhoneMask
                  onChange={(e) => phoneOnChange(e, props.setFieldValue)}
                  value={props.values['primaryPhone']}
                >
                  <FormTextfield
                    name="primaryPhone"
                    label="Phone (Optional)"
                    error={hasError(props, 'primaryPhone')}
                    helperText={
                      hasError(props, 'primaryPhone') &&
                      props.errors['primaryPhone']
                    }
                  />
                </PhoneMask>
              </Grid>
              {alexaCallingEnabled ? (
                <>
                  <Grid item xs={12} sm={12}>
                    <Switch
                      color="primary"
                      name="registerPhoneNumberWithAlexa"
                      id="Rm_preferencesPanel-alexaCallsToggle"
                      onChange={props.handleChange}
                      disabled={isAlexaCallingToggleDisabled(props)}
                      checked={props.values.registerPhoneNumberWithAlexa}
                    />
                    <Switchlabel
                      style={{
                        color: isAlexaCallingToggleDisabled(props)
                          ? 'rgba(158, 158, 158, 1)'
                          : '#000000',
                        fontSize: '14px',
                      }}
                    >
                      {strings.Form.dialog.enableCalling}
                    </Switchlabel>

                    {getAlexaCallingHelperText(props.values)}
                  </Grid>
                </>
              ) : null}
            </Grid>
          </DialogContent>
          <DialogActions>
            <ActionButton
              disabled={props.isSubmitting}
              onClick={closeModal}
              id="Rm_addFamilyModal-cancel"
            >
              {strings.Form.dialog.labelCancel}
            </ActionButton>
            <ActionButton
              color="primary"
              disabled={props.isSubmitting || !props.isValid}
              onClick={props.handleSubmit}
              id="Rm_addFamilyModal-save"
            >
              {props.isSubmitting ? (
                <CircularProgress size={25} />
              ) : isNewContact ? (
                strings.Form.dialog.labelSaveFamily
              ) : (
                strings.Form.dialog.labelSave
              )}
            </ActionButton>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
