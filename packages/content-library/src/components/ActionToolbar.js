import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { isEqual, concat, upperFirst } from 'lodash';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import SectionHeader from './SectionHeader';
import { useLocation, useHistory } from 'react-router-dom';
import LoadingModal from './LoadingModal';
import { showToast, showErrorToast } from '@teamhub/toast';
import { getCommunityId } from '@teamhub/api';
import { librarySection, contentSections } from '../utils/componentData';
import { useMutation, useSubscription } from '@teamhub/apollo-config';
import { CREATE_UPLOAD, CONTENT_CREATED } from '../graphql/content';
import ActionButtons from './ActionButtons';

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 50px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.16);
  border-bottom: 1px solid #d9d9d9;
  width: calc(100% - 100px);
  height: 50px;
  z-index: 100;
  top: 4rem;

  position: ${(props) => (props.isSticky ? 'fixed' : 'static')};

  @media (max-width: 960px) {
    padding: 10px 25px;
    width: calc(100% - 50px);
  }
`;

const BackButton = styled(IconButton)`
  && {
    padding: 10px 5px 10px 15px;
    margin-right: 10px;
  }
`;

function findSection(isMultiView) {
  if (isMultiView) {
    return librarySection;
  } else {
    const section = contentSections.find(({ slug }) =>
      location.pathname.includes(slug)
    );
    if (!section) {
      return librarySection;
    }
    return section;
  }
}

function ActionToolbar(props) {
  const { isMultiView, isSticky, backOnClick, refetchContent, ownerId } = props;
  const location = useLocation();
  const history = useHistory();
  const section = findSection();
  const [uploading, setUploading] = useState(false);
  const communityId = getCommunityId();
  const [createUpload] = useMutation(CREATE_UPLOAD);
  const UPLOAD_TIMEOUT = 10 * 1000; //10 seconds??
  const uploadingRef = useRef(uploading);
  uploadingRef.current = uploading;
  //handle all upload subscription notifications

  useSubscription(CONTENT_CREATED, {
    variables: {
      communityId: getCommunityId(),
      docType: ['photo', 'document', 'design'],
      owner: ownerId,
    },
    onSubscriptionData: () => {
      if (uploading) {
        setUploading(false);
        showToast('Your content was successfully uploaded');
      }
    },
  });

  const handleUpload = ({ target }) => {
    const files = Array.from(target.files);
    if (!files.length) return;

    // secondary check to see if files are correct for the current page
    const exts = acceptedExts();
    if (files.some(({ type }) => !exts.includes(type))) {
      let sectionType = `${upperFirst(section.name)}s`;
      let fileType = section.name === 'document' ? 'pdfs' : 'pngs or jpgs';
      if (isMultiView) {
        fileType = 'pdfs, pngs, or jpgs';
        sectionType = 'Uploads';
      }
      return showErrorToast(
        `${sectionType} must be ${fileType}. Select only ${fileType} and try again.`,
        { variant: 'error' }
      );
    }
    // proceed to finish with the rest of the function if the files are all ok
    createUpload({
      variables: {
        communityId,
        files: files.map(({ name, type }) => ({ name, type })),
      },
    })
      .then(async ({ data }) => {
        setUploading(true);
        const uploadPromises = data.community.getUploadUrl.map(async (item) => {
          const file = files.find((file) => item.name === file.name);
          return fetch(item.url, {
            method: 'PUT',
            body: file,
            'Content-Type': file.type,
          });
        });

        //upload, then wait for timeout vs subscription
        await Promise.all(uploadPromises);

        setTimeout(() => {
          if (uploadingRef.current) {
            refetchContent(true);
            setUploading(false);
          }
        }, UPLOAD_TIMEOUT);
      })
      .catch((err) => console.warn(err));
  };

  const acceptedExts = () => {
    const photoExts = ['image/jpeg', 'image/png'];
    const docExts = ['application/pdf'];
    if (isMultiView) return concat(photoExts, docExts);
    return isEqual(section.name, 'photo') ? photoExts : docExts;
  };

  return (
    <div style={{ height: 70 }}>
      <Toolbar isSticky={isSticky} id="CL_toolbar">
        {!isMultiView && (
          <BackButton
            id="CL_toolbar-back"
            data-testid="backButton"
            onClick={() => history.push(`/`)}
          >
            <ArrowBackIos />
          </BackButton>
        )}

        <SectionHeader isTitle data={section} expandable={false} />
        {uploading && <LoadingModal />}
      </Toolbar>

      <ActionButtons
        handleUpload={handleUpload}
        ownerId={ownerId}
        acceptedExts={acceptedExts}
        location={location}
      />
    </div>
  );
}

export default ActionToolbar;
