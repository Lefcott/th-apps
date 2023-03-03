/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { Person, Cake } from '@material-ui/icons';
import { CARE_SETTINGS } from '../constants';
import { Grid, MenuItem, Button } from '@material-ui/core';
import parseDate from '../utils/parseDate';
import {
  FormTextfield,
  FormDropdown,
  FormKeyboardDatePicker,
  PhoneMask,
} from '../utils/formComponents';
import { StyledExpansionPanel } from '../utils/styledComponents';
import MoveResident from './MoveResident';
import { get, isEqual } from 'lodash';
import { useQuery } from '@teamhub/apollo-config';
import { RESIDENT_GROUPS_LIST } from '../graphql/community';
import { Autocomplete } from '@material-ui/lab';
import { useFlags } from '@teamhub/api';
import PanelHeader from './PanelHeader';
import strings from '../constants/strings';

function MoveResidentContainer(props) {
  const { resident, readOnly, communityId } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        id="Rm_Form-resMoved"
        disabled={readOnly}
        color="primary"
        onClick={() => setOpen(true)}
        style={{ fontSize: 12, padding: 0 }}
      >
        Has the resident moved?
      </Button>
      <MoveResident
        open={open}
        close={() => setOpen(false)}
        resident={resident}
        communityId={communityId}
      />
    </>
  );
}

function PersonalInfoPanel(props) {
  const { readOnly, expanded, activatePanel, resident, communityId } = props;
  const hasError = (field) =>
    props.errors[field] && props.touched[field] ? true : false;

  const { data: residentGroupsData } = useQuery(RESIDENT_GROUPS_LIST, {
    variables: { communityId },
  });

  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();

  const residentGroupsList = get(
    residentGroupsData,
    'community.residentGroups.nodes',
    []
  );

  const fields = [
    'firstName',
    'lastName',
    'address',
    'primaryPhone',
    'secondaryPhone',
    'birthDate',
    'email',
    'gender',
    'careSetting',
  ];

  const panelHasError = fields.some((field) => hasError(field));

  const isAddressDisabled = () => {
    const isEnabled = isEqual(resident._id, 'new');
    return isEnabled ? false : true;
  };

  const phoneOnChange = ({ target }) =>
    props.setFieldValue(target.name, target.value);

  const validCareSettings = CARE_SETTINGS.filter(
    (item) => item.value !== 'Standard'
  );

  return (
    <StyledExpansionPanel
      id="Rm_Panel-personal"
      expanded={expanded || panelHasError}
      onChange={activatePanel}
      summary={
        <PanelHeader icon={Person} label={strings.InfoPanel.personalHeader} />
      }
      details={
        <Grid container spacing={2} style={{ width: '100%' }}>
          <Grid item xs={12} sm={6}>
            <FormTextfield
              required
              name="firstName"
              label="First Name"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['firstName']}
              error={hasError('firstName')}
              helperText={hasError('firstName') && props.errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormTextfield
              required
              name="lastName"
              label="Last Name"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['lastName']}
              error={hasError('lastName')}
              helperText={hasError('lastName') && props.errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormTextfield
              required
              name="address"
              label="Address"
              disabled={isAddressDisabled()}
              helperText={
                isAddressDisabled() ? (
                  <MoveResidentContainer
                    resident={resident}
                    readOnly={readOnly}
                    communityId={props.communityId}
                  />
                ) : (
                  hasError('address') && props.errors.address
                )
              }
              onChange={props.handleChange}
              value={resident['address']}
              error={hasError('address')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormTextfield
              name="building"
              label="Building"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['building']}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneMask
              disabled={readOnly}
              onChange={phoneOnChange}
              value={resident['primaryPhone']}
            >
              <FormTextfield
                name="primaryPhone"
                label="Primary Phone"
                disabled={readOnly}
                error={hasError('primaryPhone')}
                helperText={
                  hasError('primaryPhone') && props.errors.primaryPhone
                }
              />
            </PhoneMask>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneMask
              disabled={readOnly}
              onChange={phoneOnChange}
              value={resident['secondaryPhone']}
            >
              <FormTextfield
                name="secondaryPhone"
                label="Secondary Phone"
                disabled={readOnly}
                error={hasError('secondaryPhone')}
                helperText={
                  hasError('secondaryPhone') && props.errors.secondaryPhone
                }
              />
            </PhoneMask>
          </Grid>
          <Grid item xs={12}>
            <FormTextfield
              name="email"
              label="Email"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['email']}
              error={hasError('email')}
              helperText={hasError('email') && props.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormKeyboardDatePicker
              label="Birthday"
              id="Rm_residentBirthday-input"
              clearable
              iconbutton={<Cake />}
              buttonprops={{ id: 'Rm_residentBirthday-icon' }}
              disabled={readOnly}
              openTo="year"
              format="MM/dd/yyyy"
              onChange={(date) => props.setFieldValue('birthdate', date)}
              value={parseDate(resident['birthdate'])}
              error={hasError('birthdate')}
              helperText={hasError('birthdate') && props.errors.birthdate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormDropdown
              required
              name="gender"
              label="Gender"
              id="Rm_residentGender-input"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['gender']}
              error={hasError('gender')}
            >
              <MenuItem value="" disabled>
                - select -
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </FormDropdown>
          </Grid>
          <Grid item xs={12}>
            <FormDropdown
              name="careSetting"
              label="Care Setting"
              id="Rm_residentCareSetting-input"
              inputProps={{
                id: 'Rm_residentCareSetting-input-select',
              }}
              required
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['careSetting']}
              error={hasError('careSetting')}
              helperText={hasError('careSetting') && props.errors.careSetting}
            >
              {validCareSettings.map((careSetting) => (
                <MenuItem key={careSetting.value} value={careSetting.value}>
                  {careSetting.title}
                </MenuItem>
              ))}
            </FormDropdown>
          </Grid>
          {residentGroupsEnabled && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                disabled={readOnly}
                options={residentGroupsList}
                value={resident['residentGroups'] || []}
                getOptionLabel={(group) => group.name}
                getOptionSelected={(option, value) => option._id === value._id}
                onChange={(_, newValue) =>
                  props.setFieldValue('residentGroups', newValue)
                }
                renderInput={(params) => (
                  <FormTextfield
                    {...params}
                    name="residentGroups"
                    label="Resident Groups"
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      }
    />
  );
}

PersonalInfoPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  activatePanel: PropTypes.func.isRequired,
  resident: PropTypes.object.isRequired,
};

PersonalInfoPanel.defaultProps = {
  resident: {},
};

export default PersonalInfoPanel;
