/** @format */

import { useFormik } from 'formik';
import React from 'react';
import { get, isEmpty } from 'lodash';
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import { Box } from '@material-ui/core';
import { MenuItemContext } from '../../contexts/MenuItemContext';
import { MenuContext } from '../../contexts/MenuContext';
import { sendPendoEvent } from '@teamhub/api';

import DiningDrawer, {
  DiningDrawerCloseConfirmation,
  DiningDrawerFooter,
  DiningDrawerFooterAction,
} from '../DiningDrawer';
import SearchHeader from './SearchHeader';
import MenuItemList from './MenuItemList';
import FormHeader from './FormHeader';
import Form from './Form';

import {
  GET_MENU_ITEM_CATEGORIES_ATTRIBUTES,
  GET_MENU_ITEMS,
  CREATE_MENU_ITEM,
  ADD_ITEM_TO_MENU,
  UPDATE_MENU_ITEM,
} from '../../graphql/menuItem';

import { showToast } from '@teamhub/toast';
import { useMutation, useQuery, useLazyQuery } from '@teamhub/apollo-config';
import { getCommunityId } from '@teamhub/api';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import { withStyles } from '@material-ui/styles';
import Strings from '../../constants/strings';

function getInitialValues(currentMenuItem, searchText) {
  return {
    name: get(currentMenuItem, 'name', searchText),
    category: get(currentMenuItem, 'category', ''),
    attributes: get(currentMenuItem, 'attributes', []),
    description: get(currentMenuItem, 'description', ''),
  };
}

export const ViewState = {
  LIST: 'MenuItemList',
  FORM_ADD: 'FormAdd',
  FORM_EDIT: 'FormEdit',
};

export default function MenuItemDrawer({ open, onClose }) {
  const communityId = getCommunityId();
  const [currentView, setCurrentView] = React.useState(ViewState.LIST);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const { currentMenu } = React.useContext(MenuContext);
  const {
    info: { currentWeek, currentDay, currentMeal },
    currentSection,
    currentAvailableMenuItems,
    setCurrentAvailableMenuItems,
    refetchMenuSections,
    currentMenuItem,
    setCurrentMenuItem,
  } = React.useContext(MenuItemContext);
  const [searchText, setSearchText] = React.useState('');
  const [saveSearchText, setSaveSearchText] = React.useState('');
  const [searchTextDelayed, setSearchTextDelayed] = React.useState('');
  const alreadyAssociatedMenuItems = currentAvailableMenuItems || [];
  const [newlyAssociatedMenuItems, setNewlyAssociatedMenuItems] =
    React.useState([]);
  const [sameMenuItemName, setSameMenuItemName] = React.useState(null);
  const [loadingAddingItems, setLoadingAddingItems] = React.useState(null);
  const [loadingRemovingItems, setLoadingRemovingItems] = React.useState(null);
  const [matchedMenuItems, setMatchedMenuItems] = React.useState([]);
  const [fetchMenuItems, { data: dataMenuItems, loading: loadingMenuItems }] =
    useLazyQuery(GET_MENU_ITEMS, {
      variables: {
        communityId,
        search: searchTextDelayed,
        first: 100,
      },
      fetchPolicy: 'network-only',
    });
  const [addItemToMenu] = useMutation(ADD_ITEM_TO_MENU, {
    onError(err) {
      console.log(err);
    },
  });

  const [initialValues, setInitialValues] = React.useState(
    getInitialValues(currentMenuItem, searchText)
  );

  const { data: dataCategoriesAttributes } = useQuery(
    GET_MENU_ITEM_CATEGORIES_ATTRIBUTES,
    {
      variables: {
        communityId,
        firstAttributes: 50,
      },
    }
  );

  const allCategories = React.useMemo(() => {
    const categories =
      dataCategoriesAttributes?.community?.diningCategories || [];

    return categories.map((category) => {
      const name = category.name.replace(/\b\w/g, (l) => l.toUpperCase());
      return {
        ...category,
        name,
      };
    });
  }, [dataCategoriesAttributes?.community?.diningCategories]);

  React.useEffect(() => {
    if (!loadingMenuItems || dataMenuItems) {
      setMatchedMenuItems(dataMenuItems);
    }
  }, [dataMenuItems, loadingMenuItems]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(
        3,
        'Menu item name ' + Strings.Dining.drawer.validation.minCharacters
      )
      .max(
        70,
        'Menu item name ' + Strings.Dining.drawer.validation.maxCharacters
      )
      .required('Please enter a menu item name')
      .test('sameItemName', Strings.MenuItem.validation.exist, (value) => {
        return (
          !sameMenuItemName ||
          (currentView === ViewState.FORM_ADD &&
            sameMenuItemName?.toLowerCase() !== value?.toLowerCase()) ||
          (currentView === ViewState.FORM_EDIT &&
            (sameMenuItemName?.toLowerCase() ===
              currentMenuItem?.name?.toLowerCase() ||
              sameMenuItemName?.toLowerCase() !== value?.toLowerCase()))
        );
      }),
    category: Yup.string().required('Please choose a category'),
    description: Yup.string().nullable(),
    attributes: Yup.array().of(Yup.string()),
  });

  React.useEffect(() => {
    if (
      (currentView === ViewState.FORM_ADD && sameMenuItemName) ||
      (currentView === ViewState.FORM_EDIT &&
        sameMenuItemName?.toLowerCase() !==
          currentMenuItem?.name?.toLowerCase())
    ) {
      setFieldError('name', Strings.MenuItem.validation.exist);
    }
  }, [sameMenuItemName, currentView, currentMenuItem]);

  React.useEffect(() => {
    if (
      currentView === ViewState.LIST &&
      searchText !== '' &&
      !loadingMenuItems
    ) {
      setSearchTextDelayed(searchText);
    }
  }, [searchText, currentView, loadingMenuItems]);

  React.useEffect(() => {
    if (
      currentView === ViewState.LIST &&
      searchTextDelayed !== searchText &&
      searchText !== '' &&
      !loadingMenuItems
    ) {
      fetchMenuItems();
    }
  }, [
    searchTextDelayed,
    currentView,
    loadingMenuItems,
    fetchMenuItems,
    searchText,
  ]);

  React.useEffect(() => {
    switch (currentView) {
      case ViewState.FORM_EDIT:
        setInitialValues(getInitialValues(currentMenuItem, ''));
        break;
      case ViewState.FORM_ADD:
        setSaveSearchText(searchText);
        setInitialValues(getInitialValues(null, saveSearchText));
        setSearchText('');
        formik.resetForm();
        break;
    }
  }, [currentMenuItem, currentView, searchText]);

  const [createMenuItem, { loading: loadingCreationSubmission }] = useMutation(
    CREATE_MENU_ITEM,
    {
      async onCompleted(data) {
        await handleCompleteAddMutation(data);
      },
      onError(err) {
        if (err.message.match('409')) {
          setFieldError('name', Strings.MenuItem.validation.nameExist);
        }
      },
    }
  );

  const [updateMenuItem, { loading: loadingEditingSubmission }] = useMutation(
    UPDATE_MENU_ITEM,
    {
      async onCompleted() {
        await handleCompleteEditMutation();
      },
      onError(err) {
        if (err.message.match('409')) {
          setFieldError('name', Strings.MenuItem.validation.nameExist);
        }
      },
    }
  );

  function getAddInputValues() {
    return {
      name: values.name.trim(),
      category: values.category._id,
      description: values.description || undefined,
    };
  }

  function getInputEditValues() {
    return {
      id: currentMenuItem?.diningItemId,
      name: values.name.trim(),
      category: values.category._id,
      description: values.description || '',
    };
  }

  function updateEditedMenuItem(prevMenuItems, currentMenuItem) {
    return prevMenuItems.map((prevMenuItem) => {
      if (prevMenuItem._id !== currentMenuItem._id) {
        return prevMenuItem;
      } else {
        return {
          ...prevMenuItem,
          name: values?.name,
          category: values?.category,
          description: values?.description,
        };
      }
    });
  }

  async function onSubmit() {
    if (currentMenuItem?._id) {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.editSave);
    } else {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.createSave);
    }

    switch (currentView) {
      case ViewState.FORM_EDIT:
        await updateMenuItem({
          variables: {
            communityId,
            input: getInputEditValues(),
          },
        });

        setCurrentAvailableMenuItems((prevMenuItems) =>
          updateEditedMenuItem(prevMenuItems, currentMenuItem)
        );

        setNewlyAssociatedMenuItems((prevMenuItems) =>
          updateEditedMenuItem(prevMenuItems, currentMenuItem)
        );

      case ViewState.FORM_ADD:
        return await createMenuItem({
          variables: {
            communityId: getCommunityId(),
            input: getAddInputValues(),
          },
        });
    }
  }

  function formReset() {
    setInitialValues({
      name: '',
      category: '',
      attributes: [],
      description: '',
    });
    setSameMenuItemName(null);
    formik.resetForm();
  }

  function formClose() {
    formReset();
    setCurrentView(ViewState.LIST);
  }

  async function handleCompleteAddMutation(data) {
    showToast(Strings.MenuItem.change);
    formClose();

    // Add the new created item to the list
    setNewlyAssociatedMenuItems((prevMenuItems) => [
      ...prevMenuItems,
      {
        ...data?.community?.createDiningItem?.diningItem,
        diningItemId: data?.community?.createDiningItem?.diningItem?._id,
      },
    ]);
  }

  const handleCompleteEditMutation = React.useCallback(async () => {
    showToast(Strings.MenuItem.edit);
    formClose();
    if (searchText) {
      await fetchMenuItems();
    }
    await refetchMenuSections?.refetch();
  }, [
    fetchMenuItems,
    currentMenuItem,
    values?.name,
    values?.category,
    values?.description,
    refetchMenuSections,
  ]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { values, setFieldError } = formik;

  function handleClose() {
    onClose();
    formClose();
    setNewlyAssociatedMenuItems([]);
    setShowConfirmation(false);
    setCurrentMenuItem(null);
    setSearchText('');
  }

  function handleCancel() {
    if (currentView !== ViewState.LIST) {
      if (currentMenuItem?._id) {
        sendPendoEvent(Strings.Dining.pendoEvent.menuItem.editCancel);
      } else {
        sendPendoEvent(Strings.Dining.pendoEvent.menuItem.createCancel);
      }
      formClose();
    } else {
      if (!showConfirmation && newlyAssociatedMenuItems.length > 0) {
        setShowConfirmation(true);
      } else {
        sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellCancel);
        handleClose();
      }
    }
  }

  const sortedAssociatedMenuItems = () =>
    [...alreadyAssociatedMenuItems, ...newlyAssociatedMenuItems].sort((a, b) =>
      a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
    );

  const associatedMenuItems = React.useMemo(sortedAssociatedMenuItems, [
    alreadyAssociatedMenuItems,
    newlyAssociatedMenuItems,
  ]);

  const matchedMenuItemsDisplayable = React.useMemo(() => {
    return matchedMenuItems?.community?.diningItems?.edges
      ?.map((edge) => edge.node)
      .map((menuItem) => {
        if (
          alreadyAssociatedMenuItems.find(
            (alreadyMenuItem) => alreadyMenuItem.diningItemId === menuItem._id
          )
        ) {
          return {
            alreadyAdded: true,
            menuItem: { ...menuItem },
          };
        } else if (
          newlyAssociatedMenuItems.find(
            (newlyMenuItem) => newlyMenuItem.diningItemId === menuItem._id
          )
        ) {
          return {
            newlyAdded: true,
            menuItem: { ...menuItem },
          };
        } else {
          return {
            menuItem: { ...menuItem },
          };
        }
      });
  }, [
    matchedMenuItems?.community?.diningItems?.edges,
    alreadyAssociatedMenuItems,
    newlyAssociatedMenuItems,
  ]);

  const getHeaderTitle = React.useCallback(() => {
    return `Week ${currentWeek}: ${new Date(0, 0, currentDay).toLocaleString(
      'en-us',
      { weekday: 'long' }
    )}: ${currentMeal?.name}`;
  }, [currentWeek, currentDay, currentMeal]);

  const header = React.useMemo(() => {
    switch (currentView) {
      case ViewState.LIST:
        return (
          <SearchHeader
            text={getHeaderTitle()}
            searchText={searchText}
            onChange={setSearchText}
            onCreate={() => setCurrentView(ViewState.FORM_ADD)}
            onAdd={(menuItem) => {
              setNewlyAssociatedMenuItems((prevMenuItems) => [
                ...prevMenuItems,
                { ...menuItem, diningItemId: menuItem._id },
              ]);
              setSearchText('');
            }}
            results={matchedMenuItemsDisplayable || []}
            loading={loadingMenuItems || searchTextDelayed !== searchText}
          />
        );
      case ViewState.FORM_ADD:
        return <FormHeader onClick={formClose} title="Create New Item" />;
      case ViewState.FORM_EDIT:
        return <FormHeader onClick={formClose} title="Edit Item" />;
    }
  }, [
    currentView,
    getHeaderTitle,
    searchText,
    matchedMenuItemsDisplayable,
    loadingMenuItems,
    searchTextDelayed,
  ]);

  const content = React.useMemo(() => {
    switch (currentView) {
      case ViewState.LIST:
        return (
          <MenuItemList
            associatedMenuItems={associatedMenuItems}
            alreadyAssociatedMenuItems={alreadyAssociatedMenuItems}
            newAssociatedMenuItems={newlyAssociatedMenuItems}
            setNewAssociatedMenuItems={setNewlyAssociatedMenuItems}
            setLoadingRemovingItems={setLoadingRemovingItems}
            headerTitle={getHeaderTitle()}
            setCurrentView={setCurrentView}
          />
        );
      case ViewState.FORM_ADD:
      case ViewState.FORM_EDIT:
        return (
          <Form
            formik={formik}
            categories={allCategories}
            setSameMenuItemName={setSameMenuItemName}
            currentView={currentView}
          />
        );
    }
  }, [currentView, formik, associatedMenuItems, allCategories]);

  const handleSubmit = React.useCallback(async () => {
    sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellSave);
    if (currentView === ViewState.LIST && newlyAssociatedMenuItems.length > 0) {
      setLoadingAddingItems(true);

      await Promise.all(
        newlyAssociatedMenuItems.map((menuItem) =>
          (async () => {
            await addItemToMenu({
              variables: {
                communityId,
                input: {
                  diningItemId: menuItem._id,
                  menuId: currentMenu._id,
                  sectionId: currentSection._id,
                  daysActive: [(currentWeek - 1) * 7 + currentDay],
                },
              },
            });
          })()
        )
      );

      refetchMenuSections?.refetch?.();
      setLoadingAddingItems(false);
      setCurrentAvailableMenuItems((prevValue) => [
        ...prevValue,
        ...newlyAssociatedMenuItems,
      ]);
      setNewlyAssociatedMenuItems([]);
      showToast(`${getHeaderTitle()} updated`);
    }
    handleClose();
  }, [
    currentView,
    newlyAssociatedMenuItems,
    addItemToMenu,
    currentMenu,
    currentSection,
    currentDay,
    refetchMenuSections,
    header,
  ]);

  const loading =
    loadingCreationSubmission ||
    !!sameMenuItemName ||
    loadingAddingItems ||
    loadingRemovingItems ||
    loadingEditingSubmission;

  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  function footerRenderer() {
    const IntegrationAlert = withStyles({
      root: {
        color: '#000',
        backgroundColor: '#FFE7A1',
        fontWeight: '500',
        fontSize: '14px',
      },
    })(Alert);

    return showConfirmation ? (
      <DiningDrawerCloseConfirmation
        onConfirm={handleCancel}
        onCancel={() => setShowConfirmation(false)}
        message={Strings.Dining.drawer.closeConfirmation}
        confirmText="Cancel"
        confirmColor="secondary"
      />
    ) : (
      <>
        {!isEmpty(enabledDiningIntegrations) && (
          <Box style={{ position: 'absolute', bottom: '60px', zIndex: 1300 }}>
            <IntegrationAlert severity="warning" icon={false}>
              {' '}
              Dining integration enabled; Menus are read-only. Use your dining
              provider to update restaurant information.
            </IntegrationAlert>
          </Box>
        )}
        <DiningDrawerFooter>
          <DiningDrawerFooterAction
            id="MD_menu_item_cancel_Btn"
            onClick={handleCancel}
          >
            Cancel
          </DiningDrawerFooterAction>
          <DiningDrawerFooterAction
            id="MD_menu_item_save_Btn"
            color="primary"
            disabled={!isEmpty(enabledDiningIntegrations)}
            onClick={
              currentView === ViewState.LIST
                ? handleSubmit
                : formik.handleSubmit
            }
          >
            Save
          </DiningDrawerFooterAction>
        </DiningDrawerFooter>
      </>
    );
  }

  return (
    <DiningDrawer
      confirmOnClose
      open={open}
      loading={loading}
      confirmOnCancel={currentView === ViewState.LIST}
      onClose={handleCancel}
      onSubmit={
        currentView === ViewState.LIST ? handleSubmit : formik.handleSubmit
      }
      onCancel={handleCancel}
      headerText={header}
      saveDisabled={loading}
      footerRenderer={footerRenderer}
    >
      {content}
    </DiningDrawer>
  );
}
