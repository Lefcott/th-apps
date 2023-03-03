/** @format */

import {
  DragStatus,
  getStatusColor,
  getStatusFromFiles,
  getFilesFromEvent,
} from '../../../../src/components/PostDropzone/utils';
import { fromEvent } from 'file-selector';

jest.mock('file-selector', () => ({
  fromEvent: jest.fn(),
}));

describe('PostDropzone - utils', () => {
  let files;
  let acceptedFileTypes;

  beforeEach(() => {
    acceptedFileTypes = ['image/png', 'image/jpeg'];

    files = [
      new File(['( ͡❛ ͜ʖ ͡❛)'], 'file1.png', { type: 'image/png' }),
      new File(['ᕙ(`▿´)ᕗ'], 'file1.jpeg', { type: 'image/jpeg' }),
    ];
    fromEvent.mockImplementation(() => files);
  });

  it('should return the correct status color', () => {
    const theme = {
      palette: {
        primary: {
          main: 'red',
        },
        secondary: {
          main: 'blue',
        },
      },
    };

    expect(getStatusColor(DragStatus.ACCEPT, theme)).toBe('red');
    expect(getStatusColor(DragStatus.ERROR, theme)).toBe('blue');
    expect(getStatusColor(DragStatus.DEFAULT, theme)).toBe('transparent');
  });

  it('should get the files from event', () => {
    const event = {
      target: {
        files: files,
      },
    };

    expect(getFilesFromEvent(event)).toEqual(files);
    expect(fromEvent).toHaveBeenCalledWith(event);
  });

  it('should returns accepted if all files are of accepted types', () => {
    expect(getStatusFromFiles(files, acceptedFileTypes, 10)).toBe(
      DragStatus.ACCEPT,
    );
  });

  it('should returns error if one file is not of accepted types', () => {
    const limitedAcceptedFileTypes = [acceptedFileTypes[0]];

    expect(getStatusFromFiles(files, limitedAcceptedFileTypes, 10)).toBe(
      DragStatus.ERROR,
    );
  });

  it('should returns error if the number of files exceeds limit', () => {
    expect(getStatusFromFiles(files, acceptedFileTypes, 1)).toBe(
      DragStatus.ERROR,
    );
  });
});
