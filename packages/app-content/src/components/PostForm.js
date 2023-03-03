/** @format */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  useMediaQuery,
} from '@material-ui/core';
import {
  FormActionButton,
  FormTextfield,
  ClearableFormTextField,
} from '../utils/formComponents';
import { Formik, Form } from 'formik';
import { isUndefined } from 'lodash';
import * as Yup from 'yup';

//components
import FileSelector from './PostFileSelector';
import LinkSelector from './PostLinkSelector';
import DetailsForm from './PostDetailsForm';

import useFetch from 'use-http';
import { getUnfurlerUrl } from '../utils/environment';

const unfurlerUrl = getUnfurlerUrl();
const INVALID_CONTENT_TYPE_MESSAGE =
  "Document urls are not supported and won't display properly in the K4Community Plus App. Please download the document to your device and add it as a File to the Post.";
const INSECURE_URL_MESSAGE =
  'This URL is not secure. Please enter a URL that uses HTTPS at the beginning and not HTTP.';

const dialogActionStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

const postModalStyles = makeStyles((theme) => ({
  formMainSection: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      paddingRight: '21px !important',
    },
  },
}));

export default function PostForm({
  me,
  onSubmit,
  communityId,
  feedItem,
  disableSubmit,
  notification,
  ...props
}) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);

  useEffect(() => {
    if (feedItem.author) {
      setShowAuthorInput(true);
    }
    if (feedItem.body) {
      setShowDescriptionInput(true);
    }
  }, [feedItem]);

  const dialogActionClasses = dialogActionStyles();
  const postModalClasses = postModalStyles();
  //new post?
  const getModalTitle = () => (feedItem._id ? 'Edit Post' : 'New Post');
  const getPostButtonText = () => (feedItem._id ? 'Update Post' : 'Post');
  // errors and touched are both object props from the formik component with data
  // for each field.
  const hasError = (field, errors, touched) =>
    Boolean(errors[field] && touched[field]);
  const fieldErrors = (fieldErrors) =>
    isUndefined(fieldErrors) ? '' : fieldErrors;

  const { loading, response, post } = useFetch(unfurlerUrl, {
    cachePolicy: 'no-cache',
    cacheLife: 0,
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter a title'),
    url: Yup.string()
      .url(
        'Must enter a valid url, ensure your link starts with  `http` or `https`'
      )
      .test('insecure-url', INSECURE_URL_MESSAGE, (url) => {
        if (!url) {
          return true;
        }
        return url.startsWith('https://');
      })
      .test('valid-content-type', INVALID_CONTENT_TYPE_MESSAGE, (url) => {
        if (!url) {
          return true;
        }
        let isInvalidContentType;
        const { ok, data } = response;
        isInvalidContentType =
          !ok &&
          data &&
          data.message &&
          data.message.match(/wrong content type header/i);

        return isInvalidContentType ? false : true;
      }),
    audiences: Yup.array().min(1, 'Required').of(Yup.string()).required(),
    tags: Yup.array()
      .min(1, 'Please enter a folder')
      .of(Yup.string())
      .required('Please enter a folder'),
    startDate: Yup.date(),
    endDate: Yup.date()
      .nullable()
      .min(Yup.ref('startDate'), 'End date should not be before Start date'),
    residentGroups: Yup.array()
      .min(1, 'Please select a Resident Group')
      .of(Yup.object())
      .default([]),
    enableNotification: Yup.boolean(),
  });

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={feedItem}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        values,
        setFieldValue,
        handleSubmit,
        errors,
        touched,
      }) => (
        <>
          <DialogTitle
            style={{
              background: '#fff',
              zIndex: 9999,
              width: isMobile ? '100%' : '53%',
              boxSizing: 'border-box',
            }}
            id="form-dialog-title"
          >
            {getModalTitle()}
          </DialogTitle>
          <DialogContent style={{ marginTop: '-50px' }}>
            <Form>
              {/* form items, title, author, description */}
              <Grid container spacing={2} style={{ height: '100%' }}>
                <Grid
                  item
                  xs={12}
                  sm={7}
                  className={postModalClasses.formMainSection}
                >
                  <FormTextfield
                    name="title"
                    label="Title"
                    required
                    disabled={false}
                    onChange={handleChange}
                    value={values.title}
                    error={hasError('title', errors, touched)}
                    helperText={fieldErrors(errors.title)}
                    inputProps={{ maxLength: 255 }}
                    id="AP_postmodal-title"
                  />
                  {!showAuthorInput ? (
                    <Box ml={-1} mb={1}>
                      <FormActionButton
                        onClick={() => setShowAuthorInput(true)}
                        label="Add Author"
                        id="AP_postmodal-showAuthorInput"
                      />
                    </Box>
                  ) : (
                    <ClearableFormTextField
                      name="author"
                      label="Author"
                      disabled={false}
                      boxStyling={{ width: '100%' }}
                      onChange={handleChange}
                      value={values.author}
                      error={hasError('author', errors, touched)}
                      helperText={fieldErrors(errors.author)}
                      onClose={() => {
                        setShowAuthorInput(false);
                      }}
                      id="AP_postmodal-author"
                    />
                  )}

                  {!showDescriptionInput ? (
                    <Box mt={2} mb={2} ml={-1}>
                      <FormActionButton
                        onClick={() => setShowDescriptionInput(true)}
                        label="Add Description"
                        id="AP_postmodal-showDescriptionInput"
                      />
                    </Box>
                  ) : (
                    <ClearableFormTextField
                      multiline
                      rowsMax={15}
                      name="body"
                      label="Description"
                      disabled={false}
                      boxStyling={{ width: '100%' }}
                      onChange={handleChange}
                      value={values.body}
                      onClose={() => {
                        setShowDescriptionInput(false);
                      }}
                      id="AP_postmodal-description"
                    />
                  )}

                  {/* file selector */}
                  <FileSelector
                    data={values}
                    onChange={setFieldValue}
                    me={me}
                  />

                  {/* link component */}
                  <LinkSelector
                    data={values}
                    loading={loading}
                    post={post}
                    response={response}
                    onChange={handleChange}
                    error={!!errors.url}
                    helperText={fieldErrors(errors.url)}
                  />
                </Grid>

                {/* form details */}
                <Grid
                  item
                  xs={12}
                  sm={5}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}
                >
                  <Grid style={{ width: '100%' }}>
                    <DetailsForm
                      data={values} // feedItemData
                      notification={notification}
                      audiencesError={
                        hasError('audiences', errors, touched) &&
                        errors['audiences']
                      }
                      onChange={setFieldValue}
                      tagsError={hasError('tags', errors, touched)}
                      tagsHelperText={
                        hasError('tags', errors, touched)
                          ? fieldErrors(errors.tags)
                          : ''
                      }
                      endDateError={!!errors.endDate}
                      endDateHelperText={
                        errors.endDate ? fieldErrors(errors.endDate) : ''
                      }
                      residentGroupsError={hasError(
                        'residentGroups',
                        errors,
                        touched
                      )}
                      residentGroupsHelperText={
                        hasError('residentGroups', errors, touched)
                          ? fieldErrors(errors.residentGroups)
                          : ''
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </DialogContent>

          {/* Bottom Action Buttons */}
          <DialogActions className={dialogActionClasses.root}>
            <Button
              component={Link}
              to={{
                pathname: '/feed',
                search: `?communityId=${communityId}`,
              }}
              color="primary"
              id="AP_postmodal-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={disableSubmit}
              onClick={handleSubmit}
              id="AP_postmodal-post"
            >
              {getPostButtonText()}
            </Button>
          </DialogActions>
        </>
      )}
    </Formik>
  );
}
