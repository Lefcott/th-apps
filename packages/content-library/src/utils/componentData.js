import React from 'react';
import styled from '@emotion/styled';
import LandscapeIcon from './images/Landscape.svg';
import PortraitIcon from './images/Portrait.svg';

const OrientationIcon = styled.img`
  width: 12px;
`;

export const contentSections = [
  {
    name: 'design',
    header: 'Designs',
    slug: 'designs',
    description: 'Content made using the Creator',
    accessible: 'create',
  },
  {
    name: 'document',
    slug: 'documents',
    header: 'Documents',
    description: 'Uploaded pdf files',
    accessible: 'upload',
  },
  {
    name: 'photo',
    slug: 'photos',
    header: 'Photos',
    description: 'Uploaded photos',
    accessible: 'upload',
  },
];

export const librarySection = {
  name: 'library',
  header: 'Library',
  description: `A collection of the latest content that's been uploaded or created`,
};

export const initDesignVals = {
  name: '',
  orientation: '',
  size: '',
};

export const orientations = [
  {
    name: 'Portrait',
    icon: <OrientationIcon src={PortraitIcon} alt="portrait" />,
    value: 'portrait',
  },
  {
    name: 'Landscape',
    icon: <OrientationIcon src={LandscapeIcon} alt="landscape" />,
    value: 'landscape',
  },
];

export const designSizes = [
  {
    size: '1920px x 1080px',
    description: 'Digital Content',
    value: 'digital',
    orientation: 'landscape',
  },
  {
    size: '1080px x 1920px',
    description: 'Digital Content',
    value: 'digital',
    orientation: 'portrait',
  },
  {
    size: `11" x 8.5"`,
    description: 'Letter Size',
    value: 'letter',
    orientation: 'landscape',
  },
  {
    size: `8.5" x 11"`,
    description: 'Letter Size',
    value: 'letter',
    orientation: 'portrait',
  },
  {
    size: `17" x 11"`,
    description: 'Monthly Calendar',
    value: 'calendar',
    orientation: 'landscape',
  },
  {
    size: `36" x 24"`,
    description: 'Poster Size',
    value: 'poster',
    orientation: 'landscape',
  },
];

export const sortOptions = [
  {
    name: 'Modified Date: Desc.',
    value: 'dateDesc',
  },
  {
    name: 'Modified Date: Asc.',
    value: 'dateAsc',
  },
  {
    name: 'Name/Title: A-Z',
    value: 'nameAsc',
  },
  {
    name: 'Name/Title: Z-A',
    value: 'nameDesc',
  },
];

export const cardActions = [
  {
    name: 'editCreator',
    text: 'Edit in Creator',
    accessible: ['design'],
  },
  {
    name: 'publishApp',
    text: 'Publish to App',
    accessible: ['design', 'photo', 'document'],
  },
  {
    name: 'publishSignage',
    text: 'Publish to Signage',
    accessible: ['design', 'document'],
  },
  {
    name: 'rename',
    text: 'Rename',
    accessible: ['design', 'photo', 'document'],
  },
  {
    name: 'delete',
    text: 'Delete',
    accessible: ['design', 'photo', 'document'],
  },
  {
    name: 'print',
    text: 'Print',
    accessible: ['design', 'document'],
  },
];
