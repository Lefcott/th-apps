import React from 'react';
import ReactDOM from 'react-dom';
import DesignModal from './DesignCreation/DesignModal';
import { StyledButton } from './utils';
import { useMediaQuery, Box, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    zIndex: 200,
    borderRadius: '4px',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
  },
  icon: {
    paddingRight: '4px',
  },
  descriptorItem: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function ActionButtons(props) {
  const { handleUpload, ownerId, acceptedExts, location } = props;
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMobile = useMediaQuery('(max-width:960px)');
  const classes = useStyles();

  const handleFabClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shouldShowCreate =
    (location.pathname === '/' || location.pathname.includes('designs')) &&
    !isMobile;
  const shouldShowUpload =
    location.pathname === '/' || !location.pathname.includes('designs');

  if (isMobile) {
    return (
      shouldShowUpload && (
        <Box zIndex={200} position="absolute" bottom="1rem" right="1.5rem">
          <input
            multiple
            type="file"
            accept={acceptedExts()}
            data-testid="fileUpload"
            id="fileUpload"
            style={{ display: 'none', position: 'fixed', zIndex: 1400 }}
            onChange={handleUpload}
          />
          <label htmlFor="fileUpload">
            <StyledButton
              id="CL_toolbar-upload"
              component="span"
              color="primary"
              variant="contained"
            >
              Upload
            </StyledButton>
          </label>
        </Box>
      )
    );
  }

  return (
    <Portal>
      {shouldShowUpload && (
        <>
          <input
            multiple
            type="file"
            accept={acceptedExts()}
            data-testid="fileUpload"
            id="fileUpload"
            style={{ display: 'none', position: 'fixed', zIndex: 1400 }}
            onChange={handleUpload}
          />
          <label htmlFor="fileUpload">
            <StyledButton
              id="CL_toolbar-upload"
              component="span"
              color="primary"
              variant="contained"
            >
              Upload
            </StyledButton>
          </label>
        </>
      )}
      {shouldShowCreate && (
        <StyledButton
          id="CL_toolbar-design"
          color="primary"
          variant="contained"
          margin="left"
          onClick={() => setIsCreateOpen(true)}
        >
          Create a design
        </StyledButton>
      )}

      {isCreateOpen && (
        <DesignModal ownerId={ownerId} onClose={() => setIsCreateOpen(false)} />
      )}
    </Portal>
  );
}

function Portal(props) {
  const parent = document.getElementById('navbar-action-area');
  return ReactDOM.createPortal(props.children, parent);
}
