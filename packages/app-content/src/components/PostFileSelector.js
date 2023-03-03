/** @format */
import React, { useState, useEffect, useRef } from 'react';
import { delay } from 'lodash';
import { isEmpty, isEqual, get, cloneDeep } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, Box, FormLabel, Dialog } from '@material-ui/core';
import ContentPicker from './ContentPicker';
import {
  useMutation,
  useQuery,
  useLazyQuery,
  useSubscription,
} from '@teamhub/apollo-config';
import { getOneSearchParam } from '../utils/url';
import {
  CREATE_UPLOAD,
  CONTENT_CREATED,
  GET_CONTENTS,
  GET_CONTENT,
} from '../graphql/content';
import PostUploadFileSlider from './PostUploadFileSlider';
import { FormActionButton } from '../utils/formComponents';

function FileSelector(props) {
  const { data: feedItemData = {}, onChange } = props;
  const guids = React.useRef();

  const [showFileUploadInput, setShowFileUploadInput] = useState(false);
  const [errorFiles, setErrorFiles] = useState([]);
  const [isContentPickerOpen, setContentPickerOpen] = useState(false);
  const location = useLocation();
  const [createUpload] = useMutation(CREATE_UPLOAD);
  const [getContent] = useLazyQuery(GET_CONTENTS);
  const communityId = getOneSearchParam('communityId', '2476');
  const acceptedFileTypes = [
    'image/jpg',
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

  const contentId = getOneSearchParam('contentId', null, location.search);
  const { data: singleContentData } = useQuery(GET_CONTENT, {
    variables: { id: contentId, communityId },
    skip: !contentId,
  });
  const singleContent = get(singleContentData, 'community.content', {});
  //filter out web urls

  const assets = feedItemData.assets
    ? feedItemData.assets.filter((item) => item.type !== 'Web')
    : [];

  useEffect(() => {
    if (assets.length) {
      setShowFileUploadInput(true);
    }
  }, [assets]);

  const assetRef = useRef(assets);
  const fileRef = useRef([]); // Apollo updateQuery does not recognize the updated useState for file upload but does for useRef.

  const determineAssetType = (docType) => {
    if (!docType) {
      return 'asset';
    } else if (docType === 'design') {
      return 'Slide';
    } else {
      return docType;
    }
  };

  const getContentPreview = (content) => {
    if (content.docType === 'design') {
      const url = singleContent.images[0];
      return url && !url.match(/filename=null/) ? url : null;
    }

    return singleContent.url;
  };
  useEffect(() => {
    if (!isEmpty(singleContent)) {
      assetRef.current.push({
        _id: singleContent._id,
        name: singleContent.name,
        url: singleContent.url,
        // if its a design we want to use the first image as a preview
        preview: getContentPreview(singleContent),
        type: determineAssetType(singleContent.docType),
      });
      onChange('assets', assetRef.current);
    }
  }, [singleContent._id]);
  useEffect(() => {
    assetRef.current = assets;
  }, [assets]);

  //upload new files (move to utils?//)
  const onUploadAreaChange = async (files) => {
    if (!isEmpty(files)) {
      fileRef.current = cloneDeep(files);
      setErrorFiles([]);
      const response = await createUpload({
        variables: {
          communityId,
          files: files.map(({ name, type, newName }) => ({
            name: newName || name,
            type,
          })),
        },
      }).catch((err) => err);

      if (isEqual(response, 'error')) return 'error';
      const {
        data: {
          community: { getUploadUrl: uploads },
        },
      } = response;
      guids.current = uploads.map(({ _id }) => _id);

      const uploadPromises = uploads.map(async (upload) => {
        const file = files.find(
          (doc) =>
            isEqual(doc.name, upload.name) || isEqual(doc.newName, upload.name)
        );
        return fetch(upload.url, {
          method: 'PUT',
          body: file,
          'Content-Type': file.type,
        });
      });
      const results = await Promise.all(uploadPromises);
      const failedUploads = results
        .filter((response) => !response.ok)
        .map((response, index) => uploads[index]);

      setErrorFiles((prev) => [...prev, ...failedUploads]);
      files = [];
    }
  };

  const onFailedFileUpload = (files) => {
    setTimeout(() => setErrorFiles(files), 50);
  };

  useEffect(() => {
    getContent({
      variables: {
        communityId,
        page: {
          limit: 100,
          order: 'Desc',
          field: 'Edited',
        },
        filters: {
          onlyMine: true,
          search: null,
          docType: 'document',
        },
      },
    });
  }, []);

  useSubscription(CONTENT_CREATED, {
    variables: {
      communityId,
      docType: ['document', 'photo'],
      owner: props.me._id,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const { contentCreated } = subscriptionData.data;
      assetRef.current.push({
        _id: contentCreated._id,
        name: contentCreated.name,
        preview: contentCreated.url,
        url: contentCreated.url,
        type: determineAssetType(contentCreated.docType),
      });
      onChange('assets', assetRef.current);
      // display which files are still in progress
      fileRef.current.pop();
      onChange('uploadFiles', fileRef.current);
    },
  });

  const onContentPick = async (data) => {
    const asset = {
      _id: data._id,
      name: data.name,
      preview: data.images[0],
      url: data.url,
      type: 'Slide',
    };
    fileRef.current.push(asset);
    delay(() => {
      fileRef.current.pop();
      assetRef.current.push(asset);
      onChange('assets', assetRef.current);
    }, 1000);

    setContentPickerOpen(false);
    setErrorFiles([]);
  };

  const getFileHeader = () => {
    let header = assets.length > 1 ? 'Files' : 'File';

    return assets.length ? `${header} (${assets.length})` : header;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        {/*Show add file button */}
        {!showFileUploadInput && isEmpty(assets) ? (
          <Box mt={1} mb={1} ml={-1}>
            <FormActionButton
              id="AP_postmodal-showFileUploadInput"
              onClick={() => setShowFileUploadInput(true)}
              label="Add File"
            />
          </Box>
        ) : (
          <>
            <Box mb={1}>
              <FormLabel data-testid="AP_postmodal-file-selector-label">
                <Typography variant="caption">{getFileHeader()}</Typography>
              </FormLabel>
            </Box>
            {/*Show fancy drop area, if assets exist, show slider */}
            <PostUploadFileSlider
              assets={assets}
              errorFiles={errorFiles}
              uploadFiles={fileRef.current}
              onAssetsChange={onChange}
              acceptedFileTypes={acceptedFileTypes}
              setContentPickerOpen={setContentPickerOpen}
              onDropAreaChange={onUploadAreaChange}
              onDropAreaReject={onFailedFileUpload}
            />
          </>
        )}
        {/* Content Picker */}
        <Dialog
          fullScreen={false}
          fullWidth={false}
          maxWidth={'md'}
          open={isContentPickerOpen}
        >
          <ContentPicker
            setDesignPickerOpen={setContentPickerOpen}
            onClick={onContentPick}
          />
        </Dialog>
      </Grid>
    </Grid>
  );
}

export default FileSelector;
