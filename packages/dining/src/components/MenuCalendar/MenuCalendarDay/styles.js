import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'column nowrap',
    boxSizing: 'border-box',
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    overflow: 'hidden',
    padding: '8px 4px',
    paddingBottom: '0px',
    '&.active, &:hover': {
      backgroundColor: '#EDECFB',
      border: '1px solid #4C43DB',
    },
    '&.active $actions, &:hover $actions': {
      visibility: 'visible',
    },
  },
  actions: {
    position: 'absolute',
    top: '6px',
    right: '8px',
    display: 'flex',
    visibility: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    height: '24px',
    padding: '0px 5px 0px 8px',
    borderRadius: '4px',
    backgroundColor: '#4C43DB',
    boxShadow:
      '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);',
    color: 'white',
  },
  actionIcons: {
    fontSize: '12px',
    cursor: 'pointer',
    '&.dark': {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
  moreIconRoot: {
    marginLeft: '15px',
    fontSize: '15px',
    color: 'white',
    cursor: 'pointer',
  },
  overlay: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    backgroundImage:
      'linear-gradient(to bottom, rgba(255,255,255, 0), rgba(255,255,255, 1) 95%)',
    width: '100%',
    height: '2em',
  },
  modalRoot: {
    width: '280px',
    padding: '4px',
  },
  modalHeader: {
    paddingBottom: '0px',
  },
  modalContent: {
    paddingBottom: '24px',
    paddingTop: '2px',
  },
  modalActions: {
    padding: '0px 16px',
  },
}));
