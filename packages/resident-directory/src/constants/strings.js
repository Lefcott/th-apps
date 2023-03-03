/** @format */

export default {
  ResidentGroup: {
    create: {
      enter: (name) => `Please enter a ${name}`,
      exists: (name) => `${name} already exists. Enter a new name.`,
    },
  },
  Component: {
    created: (section) => `Your ${section} changes have been saved. `,
  },
  Validation: {
    enter: (attribute) => `Must enter a ${attribute} `,
    select: (attribute) => `Must select a ${attribute} `,
    provide: (attribute) => `Must provide a ${attribute}`,
    be: (attribute) => `Must be a ${attribute}`,
    notValid: (attribute) => `${attribute} isn't valid`,
    minCharacters: (name, min) =>
      `${name} need to be at least ${min} characters.`,
    maxCharacters: (name, max) =>
      `${name} cannot be more than ${max} characters.`,
    required: (name) => `Please enter a ${name}`,
    nameNotEmpty: 'Names must be non-empty strings',
    enterAddress: 'Must enter address for new resident',
  },
  Toasts: {
    invite: (name) => `${name} has been invited to the K4Community app`,
    reInvite: (fullName) =>
      `${fullName} has been resent an invitation to the K4Community app`,
    contactInformation: (name) =>
      `${name}'s contact information has been updated`,
    contactDeleted: (name, fullName) =>
      `${name}'s contact ${fullName} was deleted.`,
    friendsAndFamilyAdded: (residentFullName, linkedFullName, contacts) =>
      `${residentFullName} linked to ${linkedFullName} and ${contacts} friends and family added.`,
    changesSubmitted:
      'Changes submitted, please allow 24-48 hours for the changes to take effect in our system.',
    successfullyAdded: (firstName, lastName) =>
      `${firstName} ${lastName} was successfully added.`,
    changesMade: (firstName, lastName) =>
      `Changes were successfully made for ${firstName} ${lastName}.`,
  },
  Alexa: {
    device: 'This resident does not have an Alexa device.',
    calling: 'Add a phone number to use Alexa calling.',
    phoneNumbers:
      'This resident has reached the maximum number of phone numbers allowed in their Alexa directory.',
    disableAlexaCalling:
      'Disable Alexa calling for an existing friend or family member to enable Alexa calling for this person.',
    allowAlexaCalling:
      'This resident will be able to use their Alexa device to call a Friend or Family member’s Alexa device.',
  },
  Form: {
    dialog: {
      titleAddFamily: 'Add Friend or Family Member',
      titleEditFamily: 'Edit Information',
      invite:
        'An email invite to the K4 Friends & Family app will automatically be sent after adding this person.',
      enableCalling: 'Enable Alexa Calling',
      labelCancel: 'Cancel',
      labelSave: 'Save',
      labelSaveFamily: 'Add Friend/Family',
      deleteContactTitle: (name) => `Delete ${name} from friends and family? `,
      deleteContactText: (contactName, residentName) =>
        `Deleting ${contactName} from ${residentName}’s friends and family will remove ${contactName}’s access to the K4Community app.`,
      deleteResidentGroupTitle: 'Delete Resident Group',
      deleteResidentGroupWarning:
        'WARNING: Deleting this resident group will remove all residents from the group. Content targeted to this group will be visible to all residents. This action cannot be undone.',
      appCodeTitle: 'App Activation Code',
      appCodeText: (name) =>
        `After ${name} has downloaded the K4 Community app they will need to enter this code to activate their app.`,
      linkResidentsTitle: 'Link Residents',
      unlinkWarning:
        'Once residents are linked, they can only be unlinked by calling support.',
      noResidentFound: 'No residents found',
      residentSearch: 'Start typing to search residents',
    },
  },
  Resident: {
    add: 'New Resident',
    emailInUse: 'This email is already in use. Please enter a new email.',
  },
  Card: {
    button: {
      saving: 'Saving',
      back: 'Back',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      confirmDelete: 'CONFIRM DELETE',
      linkResident: 'Link Resident',
      addFriend: 'Add new friend or family',
      done: 'Done',
      manageGroups: 'Manage Groups',
    },
  },
  CareSetting: {
    noCareSetting: {
      name: 'No Care Setting',
      id: 'Standard',
    },
    emptyList: {
      title: 'We could not find anything matching:',
      search: 'Search:',
    },
  },
  PendoEvents: {
    groups: {
      addSave: 'Managegroups_add_save',
      add: 'Managegroups_add',
      directorySearch: 'directory_managegroups_search',
      directoryEditSave: 'Directory_managegroups_edit_save',
      directoryEditCancel: 'Directory_managegroups_edit_cancel',
      directoryDeleteConfirm: 'Directory_managegroups_delete_confirm',
      directoryDelete: 'Directory_managegroups_delete',
      directoryDeleteCancel: 'Directory_managegroups_delete_cancel',
      groupsOpen: 'Managegroups_open',
    },
    resident: {
      checkinHide: 'settings_residentcheckin_hide',
      checkinShow: 'settings_residentcheckin_show',
      biographyUpdate: 'res_directory_staff_update_bio',
      biographyCancel: 'res_directory_staff_cancel_bio',
    },
  },
  FilterProvider: {
    error: 'useSearch must be used inside a FilterProvider',
  },
  FriendsAndFamily: {
    title: 'Friends & Family',
    saveMessage: 'Save new resident to connect them with family and friends.',
    text: (name) =>
      `Linked residents, friends, and family members will show up in ${name}’s contact list in their app. Linked residents will share all friends and family contacts.`,
    linkedResident: 'Linked Resident',
    noLinkedResident: 'No linked resident',
    linkedResidentDeleteError: 'Linked residents cannot be removed',
    contactsAmount: (number) => `Friends & Family (${number})`,
    noListedFriendsAndFamily: 'No listed friends or family members',
    needHelp: 'Need help? Go to the ',
    supportLink: 'support page',
    activationCode: (name) => `${name}'s Activation Code`,
    duration: 'This code is good for 24 hours',
  },
  EmptyState: {
    getStarted:
      'Get started by adding your first group to your community using the “Add Group” button above.',
    questions: 'Questions? View ',
    groupSupportLink: 'Group Support Page',
  },
  InfoPanel: {
    moreHeader: 'More Information',
    personalHeader: 'Personal Information',
    preferencesHeader: 'Preferences',
    biography: 'Biography',
    noPreferences:
      'There are currently no preferences you can set for this resident.',
    visibility: 'Make profile public in K4Community Plus',
    checkInAlerts: 'Resident Check-In Alerts',
  },
  Integrations: {
    resident:
      'Resident Integration enabled. The Resident directory can not be changed in the Team Hub.',
    friendsAndFamily:
      'Friends & Family Integration enabled. The Friends & Family directory can not be changed in the Team Hub.',
    multipleIntegrations:
      'Multiple integrations are enabled. Editing  data may be restricted.',
  },
};
