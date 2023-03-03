/** @format */

import { fromEvent } from 'file-selector';
import accept from 'attr-accept';

export const DragStatus = {
  ACCEPT: 'accept',
  ERROR: 'error',
  DEFAULT: '',
};

export function getStatusColor(status, theme) {
  switch (status) {
    case DragStatus.ACCEPT:
      return theme.palette.primary.main;
    case DragStatus.ERROR:
      return theme.palette.secondary.main;
    case DragStatus.DEFAULT:
      return 'transparent';
  }
}

export function getFilesFromEvent(event) {
  return fromEvent(event);
}

export function getStatusFromFiles(files, acceptedFiles, filesLimit) {
  if (files.length > filesLimit) {
    return DragStatus.ERROR;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const accepted = fileAccepted(file, acceptedFiles);
    if (!accepted) {
      return DragStatus.ERROR;
    }
  }

  return DragStatus.ACCEPT;
}

function fileAccepted(file, acceptedFiles) {
  return file.type === 'application/x-moz-file' || accept(file, acceptedFiles);
}
