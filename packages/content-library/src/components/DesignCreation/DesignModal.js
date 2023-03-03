import React, { useState, useRef } from 'react';
import Lottie from 'react-lottie';
import styled from '@emotion/styled';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Button,
  IconButton,
  Grid,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { initDesignVals } from '../../utils/componentData';
import * as designData from '../../utils/animatedIcons/CreateDesign.json';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DesignForm from './DesignForm';
import { isEqual, findKey, includes } from 'lodash';
import { showToast, showErrorToast } from '@teamhub/toast';
import { navigate, getCommunityId, useCurrentUser } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';
import { CREATE_DESIGN, CREATE_UPLOAD } from '../../graphql/content';
import styles from './DesignModal.module.css';
import LoadingModal from '../LoadingModal';
import { DropzoneArea } from 'material-ui-dropzone';
import { buildCreatorUrl } from '../../utils/url';

const DesignFiletypes = ['.pptx', '.ppt', '.doc', '.docx'];
const mimeTypes = {
  'application/vnd.ms-powerpoint': ['pptx', 'ppt'],
  'application/msword': ['doc', 'docx'],
};
const designSchema = Yup.object().shape({
  name: Yup.string().required('Must enter a name'),
  orientation: Yup.string().required('Must select an orientation'),
  size: Yup.string().required('Must select a canvas size'),
});

const ActionButton = styled(Button)`
  && {
    width: 100%;
    margin: 10px 16px;
  }
`;

const CloseButton = styled(IconButton)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

function DesignModal(props) {
  const { onClose } = props;
  const [user] = useCurrentUser();
  const isMobile = useMediaQuery('(max-width:960px)');
  const communityId = getCommunityId();
  const [selectedFile, setSelectedFile] = useState('');
  const [uploading, setUploading] = useState(false);
  const [createDesign] = useMutation(CREATE_DESIGN);
  const [createUpload] = useMutation(CREATE_UPLOAD);
  const uploadingRef = useRef(uploading);
  uploadingRef.current = uploading;

  const submitForm = async (values) => {
    const input = {
      name: values.name.trim(),
      dimensions: `${values.size}_${values.orientation}`,
      units: isEqual(values.size, 'digital') ? 'px' : 'inches',
    };

    setUploading(true);

    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop();
      const { name, dimensions, units } = input;
      let { type } = selectedFile;
      if (type === '') {
        type = findKey(mimeTypes, (extensions) =>
          includes(extensions, extension)
        );
      }
      const { data } = await createUpload({
        variables: {
          communityId,
          files: [
            {
              name: `${name}.${extension}`,
              type,
              options: { dimensions, units },
            },
          ],
        },
      });

      const {
        community: { getUploadUrl: uploadUrl },
      } = data;

      await fetch(uploadUrl[0].url, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': type,
        },
      });
      showToast('Processing your new design...');
      setUploading(false);
      onClose();
    } else {
      createDesign({ variables: { communityId, input } })
        .then((res) => {
          const content = res.data.community.createDesign;
          setUploading(false);
          showToast('Design was successfully created');
          onClose();
          const url = buildCreatorUrl(content, user);
          navigate(url);
        })
        .catch((err) => console.warn(err));
    }
  };

  const fileSelected = (file = []) => {
    console.log(file);
    if (file.length) {
      setSelectedFile(file[0]);
    }
  };

  return (
    <>
      <Formik
        initialValues={initDesignVals}
        validationSchema={designSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <Dialog
            open={true}
            onClose={onClose}
            fullScreen={isMobile}
            disableBackdropClick
          >
            <DialogTitle>
              <Title>Create a Design</Title>
              <CloseButton onClick={onClose}>
                <Close />
              </CloseButton>
            </DialogTitle>

            <DialogContent style={{ width: 350 }}>
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: designData.default,
                  rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
                }}
                height={150}
              />
              <DesignForm {...props} />

              {!selectedFile && (
                <DropzoneArea
                  name="file"
                  type="file"
                  filesLimit={1}
                  maxFileSize={80000000}
                  acceptedFiles={DesignFiletypes}
                  dropzoneText="Optional: Upload a PowerPoint or Word document"
                  style={{ height: '200px' }}
                  showPreviews={false}
                  inputProps={{
                    id: 'CL_dropzone_input',
                  }}
                  showPreviewsInDropzone={false}
                  showAlerts={false}
                  onChange={fileSelected}
                  dropzoneClass={styles.DesignUploader}
                  dropzoneParagraphClass={styles.DesignUploaderText}
                />
              )}

              {selectedFile && (
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <CheckCircle style={{ color: 'green' }} />
                  </Grid>
                  <Grid item>
                    <span>{selectedFile.name}</span>
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <DialogActions>
              <ActionButton
                id="CL_designModal-save"
                color="primary"
                variant="contained"
                onClick={props.handleSubmit}
              >
                Create
              </ActionButton>
            </DialogActions>
          </Dialog>
        )}
      </Formik>

      {uploading && <LoadingModal />}
    </>
  );
}
export default DesignModal;
