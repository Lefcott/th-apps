/** @format */

export default {
  MenuItem: {
    change: 'Your Menu Item changes have been saved.',
    edit: 'Your Menu Item has been updated.',
    validation: {
      exist: 'This menu item already exists',
      nameExist: 'This menu item name already exists.',
    },
  },
  Menu: {
    delete: 'Your Menu was successfully deleted.',
    emptyMessage:
      'Days that have no menu items will not be read or shown on app, voice, or digital signage.',
    menuCycle: 'Enter a number between 1 and 52',
  },
  Restaurant: {
    change: 'Your restaurant changes have been saved.',
    delete: 'Your restaurant have been deleted.',
    nameError: 'Restaurant name already exists. Enter new name.',
    confirmation: {
      delete: (message) =>
        `Deleting will remove this restaurant${message} from TeamHub and K4Community.  This Action cannot be undone.`,
    },
  },
  MenuCell: {
    copyConfirmation: {
      title: 'Overwrite menu items?',
      content: 'Pasting will overwrite all menu items on this day.',
    },
    clearConfirmation: {
      title: (day, meal) => `Clear ${day} ${meal}?`,
      content: 'This action cannot be undone.',
    },
    moreActions: {
      copy: 'Copy',
      paste: 'Paste',
      clear: 'Clear',
    },
    button: {
      clear: 'CLEAR',
      ok: 'OK',
      cancel: 'CANCEL',
    },
  },
  Dining: {
    drawer: {
      closeConfirmation:
        'Are you sure you want to cancel? Any changes will be lost.',
      validation: {
        minCharacters: 'need to be at least 3 characters.',
        maxCharacters: 'cannot be more than 70 characters.',
        nameError: 'name already exists. Enter new name.',
        nameRequiredError: 'Please enter a restaurant name',
        residentGroupError: 'Please enter a resident group',
      },
      buttons: {
        save: 'Save',
        cancel: 'Cancel',
      },
    },
    selectors: {
      labels: {
        residentGroups: 'Resident Groups',
        allResidentGroups: 'All Resident Groups',
        caresettings: 'Care Settings',
        allCaresettings: 'All Care Settings',
      },
    },
    pendoEvent: {
      menu: {
        deleteCancel: 'dining_menu_delete_cancel',
        delete: 'dining_menu_delete',
        deleted: 'dining_menu_deleted',
        cellOpen: 'dining_menucell_open',
        setupOpen: 'dining_menusetup_open',
        setupError: 'dining_menusetup_error',
        setupSave: 'dining_menusetup_save',
        newMenu: 'dining_newmenu_save',
        newMenuCancel: 'dining_newmenu_cancel',
        menuSetupCancel: 'dining_menusetup_cancel',
        menuCellItemRemoved: 'dining_menucell_item_removed',
        menuOpen: 'dining_menu_open',
      },
      menuItem: {
        editSave: 'dining_menuitem_edit_save',
        createSave: 'menuItem_create_save',
        menuCellSave: 'dining_menucell_save',
        editCancel: 'dining_menuitem_edit_cancel',
        createCancel: 'menuItem_create_cancel',
        menuCellCancel: 'dining_menucell_cancel',
        edit: 'dining_menuitem_edit',
        search: 'dining_menucell_search',
        itemAdd: 'dining_menucell_item_add',
        itemCreate: 'menuItem_create',
        menuCellCopy: 'dining_menucell_copy',
        menuCellPaste: 'dining_menucell_paste',
        menuCellPasteConfirmation: 'dining_menucell_paste_confirmation',
        menuCellPasteConfirmationCancel:
          'dining_menucell_paste_confirmation_cancel',
        menuCellPasteConfirmed: 'dining_menucell_paste_confirmed',
        menuCellClear: 'dining_menucell_clear',
        menuCellClearCancel: 'dining_menucell_clear_cancel',
        menuCellClearConfirmed: 'dining_menucell_clear_confirmed',
      },
      restaurant: {
        editDelete: 'dining_editrestaurant_delete',
        editDeleted: 'dining_editrestaurant_deleted',
        editDeleteCancel: 'dining_editrestaurant_delete_cancel',
        editAddError: 'dining_editrestaurants_add_error',
        editEditError: 'dining_editrestaurants_edit_error',
        editEdit: 'dining_editrestaurants_edit',
        setupSave: 'dining_setupresto_save',
        editSave: 'dining_editrestaurants_edit_save',
        addSave: 'dining_editrestaurants_add_save',
        addCancel: 'dining_editrestaurants_add_cancel',
        editCancel: 'dining_editrestaurants_edit_cancel',
        setupCancel: 'dining_setupresto_cancel',
        setupAdd: 'dining_setupresto_add',
        editAdd: 'dining_editrestaurants_add',
        editClose: 'dining_editrestaurants_close',
        editCloseConfirm: 'dining_editrestaurants_close_confirm',
        editCloseGoBack: 'dining_editrestaurants_close_goback',
      },
    },
  },
};
