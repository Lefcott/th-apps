import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Typography,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { get } from "lodash";
import { generateIdFn } from "@shared/utils";
import { useSearch, useFetchPhotos, useFileUpload } from "@shared/hooks";
import { Search, CardList, EmptyResultText, Loader } from "@shared/components";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

const useActionStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(16),
    marginLeft: theme.spacing(1),
  },
}));

export default function PhotoModal({ unmountSelf, parcelData }) {
  const { onSubmit, onClose } = parcelData;
  const genId = generateIdFn("PhotoModal");
  const actionClasses = useActionStyles();
  const scrollRef = useBottomScrollListener(onScrollEnd);

  const [onlyMineView, setOnlyMineView] = useState(false);
  const [fetchPhotos, fetchNextPage, { loading, data }] = useFetchPhotos(
    onlyMineView,
    {
      beforeUpdate(content) {
        return isMatchSearch(content) ? content : null;
      },
    }
  );

  const [search, setSearch, searchLoading] = useSearch(fetchPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [uploadPhotos, { inprogress }] = useFileUpload({
    docType: ["photo"],
  });

  const photos = get(data, "community.contents");

  useEffect(() => {
    fetchPhotos(search);
  }, [onlyMineView]);

  function onViewChange(evt) {
    setOnlyMineView(evt.target.value);
  }

  function onScrollEnd() {
    fetchNextPage(search);
  }

  function isMatchSearch(content) {
    if (!search) {
      return true;
    }
    return !search || content?.name.match(new RegExp(search, "gi"));
  }

  function onPhotoSelect(photo) {
    const [selectedPhoto] = selectedPhotos;
    if (selectedPhoto && photo._id === selectedPhoto._id) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos([photo]);
    }
  }

  async function onPhotoUpload(photosToBeUploaded) {
    await uploadPhotos(photosToBeUploaded);
  }

  function handleCancel() {
    if (onClose) onClose();
    unmountSelf();
  }

  function handleSubmit() {
    unmountSelf();
    onSubmit(selectedPhotos);
  }

  function isPhotoSelected(photo, selections) {
    return selections.find((selectedPhoto) => selectedPhoto._id === photo._id);
  }

  function getPageState() {
    if (loading) {
      return <Loader label="loading-photos" />;
    }

    if (photos && !photos.length) {
      const message = search ? getNoSearchResultMessage() : getNoPhotoMessage();
      return <EmptyResultText message={message} />;
    }

    return (
      <CardList
        multiselect
        name="Photos"
        data={photos}
        placeholders={inprogress.length}
        onItemSelect={onPhotoSelect}
        selected={selectedPhotos}
        idFn={isPhotoSelected}
        dataMapper={{
          id: "_id",
          image: "url",
          title: "name",
        }}
      />
    );
  }

  function getNoPhotoMessage() {
    const view = onlyMineView ? "My Content" : "Community Content";
    return `No photos available in ${view}.`;
  }

  function getNoSearchResultMessage() {
    return `No photos found named "${search}".`;
  }

  return (
    <Dialog fullWidth maxWidth="md" onBackdropClick={unmountSelf} open={true}>
      <DialogTitle>Insert Photo</DialogTitle>
      <DialogContent>
        <Toolbar
          view={onlyMineView}
          search={search}
          searchLoading={!loading && searchLoading}
          onViewChange={onViewChange}
          onSearchChange={setSearch}
          onPhotoUpload={onPhotoUpload}
        />
      </DialogContent>
      <Divider />
      <DialogContent ref={scrollRef}>
        <Box  height={425}>
          {getPageState()}
        </Box>
      </DialogContent>
      <Divider />

      <DialogActions disableSpacing={true}>
        <Box mx={2} my={2} display="flex" justifyContent="flex-end">
          <Button
            id={genId("cancel")}
            classes={actionClasses}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            aria-label="add-photo"
            disabled={!selectedPhotos.length}
            id={genId("submit")}
            classes={actionClasses}
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
          >
            Insert Photo
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function Toolbar({
  onSearchChange,
  searchLoading,
  search,
  onViewChange,
  view,
  onPhotoUpload,
}) {
  const genId = generateIdFn("PhotoModal-Toolbar");

  return (
    <Box display="flex">
      <Box flex={1}>
        <TextField
          select
          fullWidth
          label="View"
          value={view}
          color="secondary"
          variant="outlined"
          id={genId("view")}
          onChange={onViewChange}
        >
          <MenuItem
            id={genId("community-view")}
            key="communityContent"
            value={false}
          >
            Community Content
          </MenuItem>
          <MenuItem id={genId("my-view")} key="myContent" value={true}>
            My Content
          </MenuItem>
        </TextField>
      </Box>

      <Box ml={1} mr={2} flex={2}>
        <Search
          genId={genId}
          value={search}
          loading={searchLoading}
          onChange={onSearchChange}
          placeholder="Search photo by name"
        />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <PhotoUpload onUpload={onPhotoUpload} id={genId("upload-button")} />
      </Box>
    </Box>
  );
}

const useUploadStyles = makeStyles((theme) => ({
  button: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  input: {
    display: "none !important",
  },
  label: {
    marginBottom: 0,
  },
  error: {
    height: 12,
    lineHeight: "initial",
    marginLeft: 11,
    visibility: ({ error }) => (error ? "visible" : "hidden"),
  },
}));

const AcceptedFiles = ["image/jpg", "image/jpeg", "image/png"];
const MaxFileSize = 1e7;

const UploadError = {
  INVALID_TYPE: "must be jpg or png",
  INVALID_SIZE: "must be less than 10MB",
};

function PhotoUpload({ id, onUpload }) {
  const [error, setError] = useState(null);
  const uploadClasses = useUploadStyles({ error });

  async function onSelectFile(ev) {
    const files = Array.from(ev.target.files);
    const acceptedFiles = [];

    files.forEach((file) => {
      if (!AcceptedFiles.find((type) => type === file.type)) {
        setError(UploadError.INVALID_TYPE);
        return;
      }
      if (file.size >= MaxFileSize) {
        setError(UploadError.INVALID_SIZE);
        return;
      }

      acceptedFiles.push(file);
    });

    if (acceptedFiles.length === files.length) {
      setError(null);
    }

    await onUpload(acceptedFiles);
  }

  return (
    <>
      <Box display="flex">
        <Box>
          <input
            id={id}
            multiple
            type="file"
            onChange={onSelectFile}
            className={uploadClasses.input}
            accept={AcceptedFiles.join(",")}
          />
          <label className={uploadClasses.label} htmlFor={id}>
            <Button
              className={uploadClasses.button}
              variant="text"
              id={id}
              component="span"
              color="secondary"
              size="large"
            >
              Upload Photo
            </Button>
          </label>
        </Box>
        <Tooltip placement="top" title="Photo must be jpg or png">
          <IconButton id={`${id}-info`} size="small">
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        className={uploadClasses.error}
        color="error"
        variant="caption"
      >
        {error}
      </Typography>
    </>
  );
}
