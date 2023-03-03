/** @format */

import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import InputMask from 'react-input-mask';
import { useLazyQuery } from '@teamhub/apollo-config';
import { Autocomplete } from '@material-ui/lab';
import { Check, Cancel, RemoveCircleOutline } from '@material-ui/icons';
import { isEmpty, isNil, get, isUndefined } from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  IconButton,
  Tooltip,
  useMediaQuery,
  Button,
  Paper,
  Slide,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
  Box,
  Typography,
} from '@material-ui/core';
import { GET_USERS } from '../graphql/users';
import { FlexContainer } from './styleUtils';
import { getOneSearchParam } from '../utils/url';
import { FormActionButton } from '../utils/formComponents';
import strings from '../constants/strings';

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const PaddedTextField = styled(TextField)`
  margin: 0;

  @media (max-width: 960px) {
    margin: 6px 0;
    padding-right: 0;
  }
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-width: 350px;
  min-height: 300px;
  padding: 20px;

  @media (max-width: 960px) {
    width: calc(100% - 40px);
    justify-content: center;
  }
`;

const ResponsiveButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 960px) {
    margin: 0;
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    right: 0;
    left: 0;
  }
`;

export function AddResidentAction(props) {
  const {
    adding,
    disabled,
    residents: options,
    loading,
    error,
    helperText,
  } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const [resident, setResident] = React.useState({});

  return (
    <FlexContainer>
      <Autocomplete
        style={{
          width: '100%',
          marginRight: props.noActions ? '0px' : '8px',
          marginTop: '0px',
          padding: '8px 0px',
        }}
        options={options}
        id={`EM_${adding}-residentSearchbar`}
        value={resident}
        loading={loading}
        getOptionLabel={(option) => option.name || ''}
        disabled={disabled}
        onChange={async (event, newValue) => {
          if (newValue) {
            setResident(newValue);
            // basically the idea is we perform the
            // parent function without needing the two action buttons
            // if we pass noActions
            if (props.noActions) {
              props.submit(newValue);
            }
          } else {
            setResident();
            if (props.noActions) {
              props.submit();
            }
          }
        }}
        renderInput={(params) => (
          <TextField
            disabled={disabled}
            fullWidth
            {...params}
            error={error}
            helperText={helperText}
            placeholder={strings.Attendance.labels.addResident}
          />
        )}
      />
      {!props.noActions && (
        <ActionContainer>
          <Action
            icon={
              <Check
                color="primary"
                fontSize={isMobile ? 'large' : 'default'}
              />
            }
            disabled={isEmpty(resident) || disabled}
            tooltip={strings.Buttons.add}
            onClick={() => props.submit(resident)}
          />
          <Action
            icon={
              <Cancel
                color="primary"
                fontSize={isMobile ? 'large' : 'default'}
              />
            }
            tooltip={strings.Buttons.cancel}
            disabled={disabled}
            onClick={() => props.setAdding(false)}
          />
        </ActionContainer>
      )}
    </FlexContainer>
  );
}

function Action(props) {
  return (
    <Tooltip title={props.tooltip}>
      <span>
        <IconButton
          disabled={props.disabled}
          size="small"
          onClick={props.onClick}
        >
          {props.icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export function SignupsForm(props) {
  // type of submission is important here, so we can change form
  const [loadUsers, { data, loading: loadingUsers }] = useLazyQuery(GET_USERS);
  React.useEffect(() => {
    loadUsers({
      variables: { communityId: getOneSearchParam('communityId', '14') },
    });
    // eslint-disable-next-line
  }, []);

  const users = get(data, 'community.residents', []);
  const residentOptions = useMemo(() => {
    return users.map((item) => ({ id: item._id, name: item.fullName }));
  }, [users]);

  const validationSchema = Yup.object().shape({
    resident: Yup.object()
      .shape({
        id: Yup.string(),
        name: Yup.string(),
      })
      .required(strings.Attendance.errors.requiredResident)
      .typeError(strings.Attendance.errors.requiredResident),
    guestInput: Yup.string()
      .test({
        name: 'guestInputSameResident',
        test(guestInput) {
          return this.parent?.resident?.name !== guestInput;
        },
        message: strings.Attendance.errors.residentGuestSame,
      })
      .when('type', (type, schema) => {
        return type === 'resident-guest'
          ? schema.required(strings.Attendance.errors.requiredGuest)
          : schema;
      }),
    type: Yup.string(),
  });

  const { errors, touched, values, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      resident: null,
      guest: '',
      guestInput: '',
      type: 'resident',
    },
    validationSchema,
    onSubmit,
  });

  const guestOptions = useMemo(() => {
    return residentOptions.filter(
      (resident) => resident.id !== values.resident?.id,
    );
  }, [residentOptions, values.resident]);

  function hasError(field) {
    return Boolean(get(errors, field) && get(touched, field));
  }

  function getErrorMessage(field) {
    return isUndefined(get(errors, field)) ? '' : get(errors, field);
  }

  function onSubmit(values) {
    props.close();
    if (values.type === 'resident') {
      props.submitResident(values.resident);
    } else if (values.type === 'resident-guest') {
      props.submitResident(values.resident, { name: values.guestInput });
    }
  }

  function renderInput(params) {
    return (
      <TextField
        fullWidth
        {...params}
        placeholder={strings.Attendance.labels.addGuest}
        error={hasError('guestInput')}
        helperText={hasError('guestInput') && getErrorMessage('guestInput')}
      />
    );
  }

  function handleGuestChange(event, newValue) {
    if (newValue) {
      setFieldValue('guest', newValue);
    } else {
      setFieldValue('guest', '');
    }
  }

  function handleGuestInputChange(event, newInputValue) {
    if (newInputValue) {
      setFieldValue('guestInput', newInputValue);
    } else {
      setFieldValue('guestInput', '');
    }
  }

  function handleRemoveGuest() {
    setFieldValue('guest', '');
    setFieldValue('guestInput', '');
    setFieldValue('type', 'resident');
  }

  return (
    <StyledForm>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        {strings.Attendance.signups.modalTitle}
      </Typography>
      <div
        style={{
          padding: '8px',
          width: '100%',
          maxHeight: '65%',
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        <AddResidentAction
          submit={(resident) => setFieldValue('resident', resident || null)}
          noActions={true}
          residents={residentOptions}
          loading={loadingUsers}
          error={hasError('resident')}
          helperText={hasError('resident') && getErrorMessage('resident')}
        />

        {values.type === 'resident' ? (
          <Box ml={-1} mb={1} mt={3}>
            <FormActionButton
              onClick={() => setFieldValue('type', 'resident-guest')}
              label={strings.Attendance.labels.addGuest}
              id="EM_signup-showGuestInput"
            />
          </Box>
        ) : (
          <Grid container spacing={3} style={{ marginTop: '8px' }}>
            <Grid xs={12} item>
              <Autocomplete
                freeSolo
                style={{ width: '100%', marginTop: '0px', padding: '8px 0px' }}
                options={guestOptions}
                id={`EM_${values.type}-guestSearchbar`}
                value={values.guest}
                inputValue={values.guestInput || ''}
                loading={loadingUsers}
                getOptionLabel={(option) => option.name || ''}
                getOptionSelected={(option, value) => option.id === value.id}
                onChange={handleGuestChange}
                onInputChange={handleGuestInputChange}
                renderInput={renderInput}
              />
            </Grid>
          </Grid>
        )}

        {values.type === 'resident-guest' && (
          <Box ml={-1} mt={2}>
            <FormActionButton
              onClick={handleRemoveGuest}
              label={strings.Attendance.labels.removeGuest}
              startIcon={<RemoveCircleOutline />}
              id="EM_signup-removeGuestInput"
            />
          </Box>
        )}
      </div>
      <ResponsiveButtonContainer>
        <Button
          style={{ width: '98px', height: '44px', margin: '5px' }}
          id="Em_attendanceModal-cancel"
          onClick={props.close}
        >
          <strong>{strings.Buttons.cancel}</strong>
        </Button>
        <Button
          style={{ width: '98px', height: '44px', margin: '5px' }}
          id="Em_attendanceModal-save"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
        >
          {strings.Buttons.save}
        </Button>
      </ResponsiveButtonContainer>
    </StyledForm>
  );
}

export function AttendanceForm(props) {
  // type of submission is important here, so we can change form
  const [type, setType] = React.useState('resident');
  const [resident, setResident] = React.useState({});
  const [guest, setGuest] = React.useState({});
  const [loadUsers, { data, loading: loadingUsers }] = useLazyQuery(GET_USERS);
  React.useEffect(() => {
    loadUsers({
      variables: { communityId: getOneSearchParam('communityId', '14') },
    });
    // eslint-disable-next-line
  }, []);

  const users = get(data, 'community.residents', []);
  const options = users.map((item) => ({ id: item._id, name: item.fullName }));

  function handleSubmit(type) {
    props.close();
    return type === 'resident'
      ? props.submitAttendee(resident)
      : props.submitGuestAttendee(guest);
  }

  return (
    <StyledForm>
      <RadioGroup
        value={type}
        onChange={(e) => setType(e.target.value)}
        row
        style={{ marginBottom: '20px' }}
      >
        <FormControlLabel
          value="resident"
          id="Em_attendanceModal-resident"
          control={<Radio color="primary" />}
          label={strings.Attendance.labels.resident}
          labelPlacement="end"
        />
        <FormControlLabel
          value="guest"
          id="Em_attendanceModal-guest"
          control={<Radio color="primary" />}
          label={strings.Attendance.labels.guest}
          labelPlacement="end"
        />
      </RadioGroup>
      <div
        style={{
          padding: '8px',
          width: '100%',
          maxHeight: '65%',
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        {type === 'resident' ? (
          <AddResidentAction
            submit={setResident}
            noActions={true}
            residents={options}
            loading={loadingUsers}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid xs={12} item>
              <PaddedTextField
                label={strings.Attendance.labels.name}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
              ></PaddedTextField>
            </Grid>
            <Grid xs={12} item>
              <InputMask
                {...props}
                mask="999-999-9999"
                maskChar=" "
                value={guest.phone}
                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              >
                {() => (
                  <PaddedTextField
                    label={strings.Attendance.labels.phone}
                    fullWidth
                    optional
                    InputLabelProps={{ shrink: true }}
                  ></PaddedTextField>
                )}
              </InputMask>
            </Grid>
          </Grid>
        )}
      </div>
      <ResponsiveButtonContainer>
        <Button
          style={{ width: '98px', height: '44px', margin: '5px' }}
          id="Em_attendanceModal-cancel"
          onClick={props.close}
        >
          <strong>{strings.Buttons.cancel}</strong>
        </Button>
        <Button
          style={{ width: '98px', height: '44px', margin: '5px' }}
          id="Em_attendanceModal-save"
          onClick={() => handleSubmit(type)}
          disabled={
            type === 'resident'
              ? isEmpty(resident) || isNil(resident)
              : !guest.name
          }
          color="primary"
          variant="contained"
        >
          {strings.Buttons.save}
        </Button>
      </ResponsiveButtonContainer>
    </StyledForm>
  );
}

const PartialPaper = styled(Paper)`
  height: 80vh;
  width: 100vw;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
`;

export function PartialScreenModal(props) {
  const { active } = props;
  return (
    <Slide direction="up" in={active} mountOnEnter unmountOnExit>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, .65)',
        }}
      >
        <PartialPaper>{props.children}</PartialPaper>
      </div>
    </Slide>
  );
}
