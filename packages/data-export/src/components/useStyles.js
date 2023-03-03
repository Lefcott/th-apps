import { makeStyles } from '@material-ui/core/styles';

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      margin: 0,
    },
  },
}));

const useDialogContentStyles = makeStyles(() => ({
  root: {
    overflowY: 'visible',
  },
}));

const useDialogActionsStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const useDownloadButtonStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.37) !important',
  },
  text: {
    color: '#fff',
  },
}));

const useCircularProgressStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(1),
  },
  colorPrimary: {
    color: '#fff',
  },
}));

export {
  useDialogActionsStyles,
  useDialogContentStyles,
  useDialogStyles,
  useDownloadButtonStyles,
  useCircularProgressStyles,
};
