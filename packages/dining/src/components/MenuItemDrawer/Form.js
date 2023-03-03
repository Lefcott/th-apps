/** @format */

import React from 'react';
import { get, isUndefined } from 'lodash';
import { Box, Typography } from '@material-ui/core';

import CategorySelector from '../selectors/CategorySelector';
import { FormTextfield } from '../../utils/formComponents';
import { ViewState } from './MenuItemDrawer';

import { GET_SAME_MENU_ITEM } from '../../graphql/menuItem';

import { useLazyQuery } from '@teamhub/apollo-config';
import { getCommunityId } from '@teamhub/api';

export default function MenuItemDrawerForm({
  formik,
  categories,
  setSameMenuItemName,
  currentView,
}) {
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
  } = formik;

  const [nameDelayed, setNameDelayed] = React.useState(values.name);

  const communityId = getCommunityId();

  function hasError(field) {
    return Boolean(get(errors, field) && get(touched, field));
  }

  function getErrorMessage(field) {
    return isUndefined(get(errors, field)) ? '' : get(errors, field);
  }

  let [
    fetchSameMenuItem,
    { data: dataSameMenuItem, loading: loadingSameMenuItem },
  ] = useLazyQuery(GET_SAME_MENU_ITEM, {
    variables: {
      communityId,
      search: nameDelayed,
    },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loadingSameMenuItem) {
      if (
        dataSameMenuItem?.community?.diningItems?.edges?.length > 0 &&
        dataSameMenuItem.community.diningItems.edges[0].node?.name?.toLowerCase() ===
          values.name.toLowerCase()
      ) {
        setSameMenuItemName(
          dataSameMenuItem.community.diningItems.edges[0].node?.name
        );
      } else {
        setSameMenuItemName(null);
      }
    }
  }, [loadingSameMenuItem, dataSameMenuItem, setSameMenuItemName]);

  React.useEffect(() => {
    if (values.name !== '' && !loadingSameMenuItem) {
      setNameDelayed(values.name);
    }
  }, [values.name, loadingSameMenuItem]);

  React.useEffect(() => {
    if (
      values.name !== '' &&
      !loadingSameMenuItem &&
      nameDelayed !== values.name
    ) {
      fetchSameMenuItem();
    }
  }, [nameDelayed, loadingSameMenuItem, fetchSameMenuItem, values.name]);

  return (
    <Box px={3} py={2.5}>
      <Box mb={3.5}>
        <Typography variant="body1">
          Creating a new item will add it to your current menu, and add it to
          the library for future use on other menus.
        </Typography>
      </Box>

      <Box mb={3}>
        <FormTextfield
          required
          name="name"
          label="Item"
          variant="outlined"
          value={values.name}
          error={hasError('name')}
          helperText={hasError('name') && getErrorMessage('name')}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      </Box>
      <Box mb={3}>
        <CategorySelector
          required
          label="Category * "
          name="category"
          variant="outlined"
          options={categories}
          error={hasError('category')}
          helperText={hasError('category') && getErrorMessage('category')}
          value={values.category}
          onChange={(value) => setFieldValue('category', value)}
          onBlur={handleBlur}
        />
      </Box>
      <Box mb={3}>
        <FormTextfield
          id="MD_Menu-item-description"
          name="description"
          label={
            currentView === ViewState.FORM_ADD
              ? 'Description (Optional)'
              : 'Description'
          }
          variant="outlined"
          value={values.description}
          error={hasError('description')}
          helperText={hasError('description') && getErrorMessage('description')}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Add Description"
          multiline={currentView === ViewState.FORM_EDIT}
          rows={4}
        />
      </Box>
    </Box>
  );
}
