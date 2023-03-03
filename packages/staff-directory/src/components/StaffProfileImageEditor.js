/** @format */

import React from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { get as _get } from 'lodash';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const useDialogStyles = makeStyles((theme) => ({
  root: {
    zIndex: '9999 !important',
  },

  paper: {
    height: theme.spacing(70),
    width: theme.spacing(75),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      margin: 0,
    },
  },
}));

const useButtonStyles = makeStyles((theme) => ({
  root: {
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
  },
}));

const useAvatarStyles = makeStyles((theme) => ({
  root: (props) => ({
    padding: 0,
    width: theme.spacing(12),
    height: theme.spacing(12),
    fontSize: theme.spacing(5),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }),
  colorDefault: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function StaffProfileImageEditor({
  handleChange,
  values,
  isEdit,
  ...props
}) {
  const [uploadedImage, setUploadedImage] = React.useState();
  const [cropperActive, setCropperActive] = React.useState(false);
  const [completedCrop, setCompletedCrop] = React.useState();
  const imgRef = React.useRef(null);
  const displayRef = React.useRef(null);
  const [crop, setCrop] = React.useState({
    unit: '%',
    width: 30,
    x: 50,
    y: 50,
    aspect: 1,
  });
  const dialogClasses = useDialogStyles();
  const avatarClasses = useAvatarStyles({ src: values.staff.profileImage });
  const buttonClasses = useButtonStyles();
  const theme = useTheme();
  function handleImage() {
    if (uploadedImage) {
      return uploadedImage;
    } else if (values.staff.profileImage) {
      return values.staff.profileImage.includes('misc/profile.svg')
        ? null
        : values.staff.profileImage;
    } else {
      return null;
    }
  }

  function submitImage() {
    closeModal();
    if (!completedCrop) {
      return;
    }
    const canvas = document.createElement('canvas');
    const crop = completedCrop;
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    canvas.toBlob(
      (blob) => {
        // uploadedImage.filename is undefined
        setUploadedImage(URL.createObjectURL(blob));
        handleChange({
          target: {
            name: 'file',
            value: new File([blob], 'profileImage.jpeg', {
              type: 'image/jpeg',
            }),
          },
        });
      },
      'image/jpeg',
      1,
    );
  }

  const onLoad = React.useCallback((img) => {
    imgRef.current = img;
  }, []);

  const closeModal = React.useCallback(() => setCropperActive(false), []);

  function handleImageUpload(evt) {
    if (evt.target.files && evt.target.files.length > 0) {
      const reader = new FileReader();
      // once the file is loaded, we'll set the image and open the cropper modal
      reader.addEventListener('load', () => {
        setUploadedImage(reader.result);
        setCropperActive(true);
      });
      reader.readAsDataURL(evt.target.files[0]);

      // clean up input so i can re-select a file if i want to
      evt.target.value = '';
    }
  }

  function returnInitials(values) {
    let initials = '';
    if (values.staff.firstName) {
      initials += values.staff.firstName[0];
    }
    if (values.staff.lastName) {
      initials += values.staff.lastName[0];
    }
    return initials || null;
  }

  function removePhoto() {
    handleChange({ target: { value: null, name: 'file' } });
    handleChange({ target: { value: null, name: 'staff.profileImage' } });
    setUploadedImage(null);
    if (displayRef.current) {
      displayRef.current.src = null;
    }
  }
  return (
    <>
      <Avatar
        ref={displayRef}
        src={handleImage()}
        alt={`${values.staff.firstName} ${values.staff.lastName}`}
        classes={avatarClasses}
      >
        {returnInitials(values)}
      </Avatar>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="photo-upload"
          type="file"
          onChange={handleImageUpload}
          id="SD_StaffMemberForm-field-uploadphoto"
        ></input>
        <label htmlFor="SD_StaffMemberForm-field-uploadphoto">
          <Button
            classes={buttonClasses}
            variant="text"
            id="SD_StaffMemberForm-field-uploadphoto-button"
            component="span"
          >
            {values.staff.profileImage ? 'Replace' : 'Upload'} Photo
          </Button>
        </label>

        {(values.staff.profileImage || uploadedImage) && (
          <>
            <span
              style={{
                margin: '5px 0 5px 0',
                color: theme.palette.text.secondary,
              }}
            >
              |
            </span>
            <Button
              component="span"
              classes={buttonClasses}
              variant="text"
              component="span"
              id="SD_StaffMemberForm-field-removephoto"
              onClick={removePhoto}
            >
              Remove Photo
            </Button>
          </>
        )}
      </div>
      <Dialog open={cropperActive} classes={dialogClasses}>
        <DialogContent>
          <ReactCrop
            src={uploadedImage}
            crop={crop}
            onImageLoaded={onLoad}
            onChange={(c) => setCrop(c)}
            circularCrop
            onComplete={setCompletedCrop}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={submitImage}
            id="SD_StaffMemberForm-cropper-confirm"
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
