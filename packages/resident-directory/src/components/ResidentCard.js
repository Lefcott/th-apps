/** @format */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  omit as _omit,
  sortBy as _sortBy,
  toLower as _toLower,
  isNil as _isNil,
  orderBy as _orderBy,
  isEqual,
  isNil,
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  Card,
  Avatar,
  useMediaQuery,
  Button,
  Backdrop,
} from '@material-ui/core';
import { newResident } from '../utils/componentData';
import { Formik } from 'formik';
import PhoneNumber from 'awesome-phonenumber';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { showToast, showErrorToast } from '@teamhub/toast';
import {
  GET_RESIDENT,
  GET_RESIDENTS,
  UPDATE_RESIDENT,
  ADD_RESIDENT,
  UPLOAD_PROFILE_IMAGE,
  INVITE_USER,
  ADD_RESIDENT_TO_RESIDENT_GROUP,
  REMOVE_RESIDENT_FROM_GROUP,
} from '../graphql/users';
import { getCommunityId, sendPendoEvent, useFlags } from '@teamhub/api';
import { CardPlaceholder } from '../utils/loadingPlaceholders';
import CardButtons from './CardButtons';
import PersonalInfoPanel from './PersonalInfoPanel';
import BiographyPanel from './BiographyPanel';
import FriendsFamilyPanel from './FriendsFamilyPanel';
import MoreInfoPanel from './MoreInfoPanel';
import PreferencesPanel from './PreferencesPanel';
import { CardEmptyState } from './EmptyState';
import { activeResidentVar } from '../apollo.config';
import strings from '../constants/strings';
import useResidentList from '../hooks/useResidentList';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

function parseEmailExistsError(err) {
  const graphErrorArray = err['graphQLErrors'];
  if (!graphErrorArray) {
    return;
  }
  const emailAlreadyInUse = graphErrorArray.find(
    (item) =>
      item.extensions.response.status == 405 &&
      item.extensions.response.body === 'user already exists',
  );
  if (emailAlreadyInUse) {
    return strings.Resident.emailInUse;
  }
}

// some minimal phone number validation
// awesome-phonenumber is kind of a large bundle so we may
// want to let the server do most of the parsing here, idk
const AVATAR_PLACE_HOLDER =
  'https://k4connect-shared.s3.amazonaws.com/misc/profile.svg';

export function validatePhone(value) {
  if (value) {
    const number = new PhoneNumber(value, 'US');
    return number.isValid();
  }
  return true; // return true since we let this be nullable
}

const userSchema = Yup.object().shape({
  _id: Yup.string(),
  firstName: Yup.string()
    .min(1)
    .matches(/\S/i, {
      message: strings.Validation.nameNotEmpty,
    })
    .required(strings.Validation.provide('first name')),
  lastName: Yup.string()
    .min(1)
    .matches(/\S/i, {
      message: strings.Validation.nameNotEmpty,
    })
    .required(strings.Validation.provide('last name')),
  address: Yup.string()
    .nullable()
    .when('_id', {
      is: 'new',
      then: Yup.string().required(strings.Validation.enterAddress).min(1),
    }),
  gender: Yup.string().required(),
  email: Yup.string().email(strings.Validation.enter('email')).nullable(),
  birthdate: Yup.date()
    .max(new Date(), 'Birthdate must be in the past')
    .typeError(strings.Validation.be('valid date'))
    .nullable(),
  primaryPhone: Yup.string()
    .test(
      'isValidPhoneNumber',
      strings.Validation.notValid('Phone number'),
      validatePhone,
    )
    .nullable(),
  secondaryPhone: Yup.string()
    .test(
      'isValidPhoneNumber',
      strings.Validation.notValid('Phone number'),
      validatePhone,
    )
    .nullable(),
  biography: Yup.string().nullable(),
  careSetting: Yup.string()
    .matches(
      /Independent|Assisted|Memory Care|Skilled Nursing/,
      strings.Validation.provide('care setting'),
    )
    .typeError(strings.Validation.provide('care setting'))
    .required(),
  residentGroups: Yup.array().nullable(),
});

const ResidentCardWrapper = styled(Card)`
  &&&& {
    height: 100%;
    width: 100%;
    display: flex;
    border-radius: 2px;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    height: 100%;
    height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  }
`;

const ScrollWrapper = styled.div`
  background-color: #e5e5e5;
  flex: 1 1 auto;
  overflow: scroll;
`;

const ResidentCardHeader = styled.div`
  background-image: linear-gradient(132deg, #0a7277, #60c2c7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media (min-width: 960px) {
    padding: 10px 0 30px;
  }
`;

const CardBody = styled.div`
  position: relative;
  background-color: #e5e5e5;
  width: 100%;
  flex: 1 1 auto;
`;

const AccordionContainer = styled.div`
  position: absolute;
  top: -22px;
  left: 50%;
  width: 90%;
  transform: translateX(-50%);
  border-radius: 4px;
  margin-bottom: 15px;
`;

// This resident card shows the current resident
function ResidentCard(props) {
  const { activeId, previousActiveId } = props;
  const isNewResident = isEqual(activeId, 'new');
  const isListEmpty = isNil(activeId);
  const [editing, setEditing] = useState(false);
  const [activePanel, setActivePanel] = useState();
  const communityId = getCommunityId();
  const [editResident] = useMutation(UPDATE_RESIDENT);
  const [addResident] = useMutation(ADD_RESIDENT);
  const [inviteUser] = useMutation(INVITE_USER);
  const [addResidentToResidentGroup] = useMutation(
    ADD_RESIDENT_TO_RESIDENT_GROUP,
  );
  const [removeResidentFromGroup] = useMutation(REMOVE_RESIDENT_FROM_GROUP);
  let initialValues;

  const { integrations } = React.useContext(IntegrationsContext);
  const {
    residentIntegrationEnabled = false,
    familyIntegrationEnabled = false,
  } = integrations;

  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();

  const { refetch: refetchList } = useResidentList();

  let { loading, data, refetch } = useQuery(GET_RESIDENT, {
    errorPolicy: 'all',
    variables: { id: activeId, communityId },
    skip: isNewResident || isListEmpty,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
  });

  useEffect(() => {
    let activePanel,
      isEditing = false;
    if (isNewResident) {
      activePanel = 'personalInfo';
      isEditing = true;
    }
    setActivePanel(activePanel);
    setEditing(isEditing);
  }, [activeId, isNewResident]);

  const cancelOnClick = ({ resetForm, values, initialValues }) => {
    setEditing(false);
    if (values.biography !== initialValues.biography) {
      sendPendoEvent(strings.PendoEvents.resident.biographyCancel);
    }
    resetForm();
    if (isNewResident) {
      activeResidentVar(previousActiveId);
    }
  };

  const activatePanel = (panel) => (_, isExpanded) => {
    setActivePanel(isExpanded ? panel : null);
  };
  const cleanObj = (obj) => {
    return Object.entries(obj).reduce(
      (acc, item) => {
        let prop = item[0];
        let value = item[1];

        // if the loaded resident had this prop before, but now the value is
        // null or an empty string, pass it back for deletion
        if (get(data, `resident.${prop}`) && (_isNil(value) || value === '')) {
          acc.deletions.push(prop);
        } else if (!_isNil(value) && value !== '') {
          // otherwise, if the value exists, put it into the values obj for editing/adding
          acc = {
            ...acc,
            values: {
              ...acc.values,
              // trim string values on submission
              [prop]: typeof value === 'string' ? value.trim() : value,
            },
          };
        }
        return acc;
      },
      { values: {}, deletions: [] },
    );
  };

  const submitForm = async (incomingValues, formik) => {
    const { values, deletions } = cleanObj(incomingValues);
    values.roomNumber = values.address;
    values.optOutOfDirectory = !values.optOutOfDirectory;
    delete values.address;

    try {
      if (values._id === 'new') {
        await handleAdd(values);
        await refetchList({ fetchPolicy: 'network-only' });
      } else {
        if (
          initialValues.biography !== values.biography &&
          !(isEmpty(initialValues.biography) && isEmpty(values.biography))
        ) {
          sendPendoEvent(strings.PendoEvents.resident.biographyUpdate);
        }
        await Promise.all([
          handleEdit(values, deletions),
          updateResidentGroups(values),
        ]);
      }

      // This doesn't have an await to not block the UI while the refetch is happening
      refetch({ fetchPolicy: 'network-only' });

      showToast(
        strings.Toasts[
          values._id === 'new' ? 'successfullyAdded' : 'changesMade'
        ](values.firstName, values.lastName),
      );
    } catch (err) {
      const errorMessage = parseEmailExistsError(err);
      if (errorMessage) {
        formik.setFieldError('email', errorMessage);
      } else {
        showErrorToast();
      }
    } finally {
      resetStateAfterSubmission();
    }
  };

  async function handleAdd(values) {
    const { data } = await addResident({
      variables: {
        communityId,
        newResidentInput: _omit(values, [
          '_id',
          'linkedResident',
          'rooms',
          'residentGroups',
        ]),
      },
      async update(cache, { data }) {
        const newResident = data.community.addResident;
        resortResidentList(cache, newResident);
      },
    });

    const newResidentId = data.community.addResident._id;

    await inviteUser({
      variables: {
        communityId,
        id: newResidentId,
      },
    });

    if (residentGroupsEnabled) {
      await updateResidentGroups({
        ...values,
        _id: newResidentId,
      });
    }

    activeResidentVar(newResidentId);
  }

  async function handleEdit(values, deletions) {
    await editResident({
      variables: {
        // we need to omit most properties on the user
        edits: {
          ..._omit(values, [
            '_id',
            'contacts',
            '__typename',
            'fullName',
            'profileImage',
            'linkedResident',
            'moveRoomPending',
            'residentGroups',
            'rooms',
            'alexaAddressBook',
          ]),
        },
        deletions,
        communityId: communityId,
        residentId: values._id,
      },
      async update(cache) {
        // if the name has changed at all, resort the list
        if (data.resident.lastName !== values.lastName) {
          resortResidentList(cache);
        }
      },
    });

    if (!values.optOutOfDirectory) {
      sendPendoEvent(strings.PendoEvents.resident.checkinHide);
    } else {
      sendPendoEvent(strings.PendoEvents.resident.checkinShow);
    }
  }

  async function updateResidentGroups(values) {
    const oldGroups = get(data, 'resident.residentGroups', [])?.map(
      (group) => group._id,
    );

    const currentGroups =
      values.residentGroups?.map((group) => group._id) || [];

    const newGroups =
      currentGroups.filter((group) => !oldGroups.includes(group)) || [];

    const removedGroups = oldGroups.filter(
      (group) => !currentGroups.includes(group),
    );

    await addResidentToResidentGroup({
      variables: {
        communityId,
        input: {
          residentId: values._id,
          residentGroupIds: newGroups,
        },
      },
    });

    await removeResidentFromGroup({
      variables: {
        communityId,
        input: {
          residentId: values._id,
          residentGroupIds: removedGroups,
        },
      },
    });
  }

  function resortResidentList(cache, addedResident) {
    const data = cache.readQuery({
      query: GET_RESIDENTS,
      variables: { communityId, skipResidentGroupFields: true },
    });

    const residents = data.community.residents.slice(0);
    if (addedResident) residents.push(addedResident);

    const sortedResidents = _orderBy(
      data.community.residents,
      [(res) => _toLower(res.lastName)],
      ['asc'],
    );

    cache.writeQuery({
      variables: {
        communityId,
        skipResidentGroupFields: true,
      },
      query: GET_RESIDENTS,
      data: {
        ...data,
        community: {
          ...data.community,
          residents: sortedResidents,
        },
      },
    });
  }

  function resetStateAfterSubmission() {
    setEditing(false);
    setActivePanel(activePanel);
  }

  if (
    (!isEqual(get(data, 'resident._id'), activeId) && loading) ||
    isEqual(activeId, undefined)
  )
    return <CardPlaceholder />;
  const { me } = props;

  if (data?.resident || isNewResident) {
    data = {
      ...data,
      resident: {
        ...data?.resident,
        optOutOfDirectory: !data?.resident?.optOutOfDirectory,
      },
    };

    initialValues = isNewResident ? newResident : data.resident;
    return (
      <Formik
        initialValues={initialValues}
        validateOnBlur
        enableReinitialize={isNewResident || data?.resident?._id !== activeId}
        validationSchema={userSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <>
            <Backdrop open={editing} style={{ zIndex: 149 }} />
            <ResidentCardWrapper style={{ zIndex: 150 }}>
              <ScrollWrapper id="scroll-wrapper">
                <ResidentCardHeader>
                  <ResidentCardImage
                    imageSrc={props.values.profileImage}
                    activeId={activeId}
                    communityId={communityId}
                  />
                </ResidentCardHeader>
                <CardBody>
                  <AccordionContainer>
                    <PersonalInfoPanel
                      {...props}
                      expanded={activePanel === 'personalInfo'}
                      activatePanel={activatePanel('personalInfo')}
                      resident={props.values}
                      readOnly={
                        !editing ||
                        props.isSubmitting ||
                        residentIntegrationEnabled
                      }
                      communityId={communityId}
                    />
                    <BiographyPanel
                      {...props}
                      expanded={activePanel === 'biography'}
                      activatePanel={activatePanel('biography')}
                      resident={props.values}
                      readOnly={
                        !editing ||
                        props.isSubmitting ||
                        residentIntegrationEnabled
                      }
                      communityId={communityId}
                    />
                    <FriendsFamilyPanel
                      {...props}
                      expanded={activePanel === 'friendsFamily'}
                      activatePanel={activatePanel('friendsFamily')}
                      resident={data.resident}
                      refetchResident={refetch}
                      readOnly={props.isSubmitting}
                      familyIntegrationEnabled={familyIntegrationEnabled}
                    />
                    <MoreInfoPanel
                      {...props}
                      expanded={activePanel === 'moreInfo'}
                      activatePanel={activatePanel('moreInfo')}
                      resident={props.values || props.isSubmitting}
                      readOnly={!editing || residentIntegrationEnabled}
                    />
                    <PreferencesPanel
                      {...props}
                      expanded={activePanel === 'preferences'}
                      activatePanel={activatePanel('preferences')}
                      resident={props.values || props.isSubmitting}
                      readOnly={!editing}
                      communityId={communityId}
                      me={me}
                    />
                  </AccordionContainer>
                </CardBody>
              </ScrollWrapper>
              <CardButtons
                {...props}
                editing={editing}
                isSubmitting={props.isSubmitting}
                cancel={() => cancelOnClick(props)}
                edit={() => setEditing(true)}
                save={props.handleSubmit}
              />
            </ResidentCardWrapper>
          </>
        )}
      </Formik>
    );
  }
  // default return if no users / active user
  return (
    <ResidentCardWrapper>
      <CardEmptyState />
    </ResidentCardWrapper>
  );
}

ResidentCard.propTypes = {
  nextResident: PropTypes.object,
};

export default ResidentCard;

function ResidentCardImage(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const { imageSrc } = props;

  const [uploadFile] = useMutation(UPLOAD_PROFILE_IMAGE);
  let handleImageUpload = async (file) => {
    if (file) {
      try {
        await uploadFile({
          variables: {
            file: file,
            communityId: props.communityId,
            residentId: props.activeId,
          },
        });
      } catch (err) {
        showErrorToast();
        console.warn('wha the', err);
      }
    }
  };
  if (isMobile) {
    return (
      <label for="profileImg" style={{ width: '100%' }}>
        <img
          src={imageSrc || AVATAR_PLACE_HOLDER}
          alt="profileImg"
          style={{
            height: '200px',
            width: '100%',
            objectFit: 'cover',
            imageOrientation: 'from-image',
          }}
        />
        <input
          type="file"
          disabled={props.activeId === 'new'}
          name="image"
          id="profileImg"
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
      </label>
    );
  }
  return (
    <>
      <Avatar
        style={{ height: 150, width: 150 }}
        src={imageSrc || AVATAR_PLACE_HOLDER}
      />
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={(e) => {
          handleImageUpload(e.target.files[0]);
        }}
      ></input>
      {props.activeId !== 'new' && (
        <label htmlFor="raised-button-file">
          <Button
            id="Rm_Form-photoUpload"
            variant="text"
            component="span"
            style={{
              color: 'white',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.25)',
            }}
          >
            Change Photo
          </Button>
        </label>
      )}
    </>
  );
}
