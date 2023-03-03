/** @format */

import getCodeIcon from '../assets/images/getAppCode.svg';
import moveResidentIcon from '../assets/images/moveResident.svg';

export const contactListOptions = [
  {
    name: 'View and Edit',
    alias: 'edit',
    className: 'Rm_familyPanel-contact-edit',
  },
  {
    name: 'Send App Invite',
    alias: 'invite',
    className: 'Rm_familyPanel-contact-invite',
  },
  {
    name: 'Get App Code',
    alias: 'code',
    className: 'Rm_familyPanel-contact-code MuiListItem-divider',
  },
  {
    name: 'Delete',
    alias: 'delete',
    className: 'Rm_familyPanel-contact-delete RM_menuItem-red',
  },
];

export const familyIntegrationEnabledOptions = [
  {
    name: 'Send App Invite',
    alias: 'invite',
    className: 'Rm_family_Panel-contact-invite',
  },
  {
    name: 'Get App Code',
    alias: 'code',
    className: 'Rm_familyPanel-contact-code MuiListItem-divider',
  },
];

export const swipeButtons = [
  {
    name: 'Resident Move',
    alias: 'move',
    position: 'right',
    icon: moveResidentIcon,
    style: {
      background: '#ad2f69',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: 'bold',
      width: '90px',
    },
  },
  {
    name: 'Get App Code',
    alias: 'invite',
    position: 'right',
    icon: getCodeIcon,
    style: {
      background: '#1876d3',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: 'bold',
      width: '90px',
    },
  },
];

export const newResident = {
  _id: 'new',
  firstName: '',
  lastName: '',
  address: '',
  building: '',
  primaryPhone: '',
  secondaryPhone: '',
  email: '',
  birthdate: null,
  biography: '',
  careSetting: null,
  residenceType: null,
  gender: '',
  moveInDate: new Date(),
  residentGroups: [],
  checkin: true, // we want this to always be default true
  optOutOfDirectory: true, // We initialize optOut in true since the switch works inverse to the boolean flag
};
