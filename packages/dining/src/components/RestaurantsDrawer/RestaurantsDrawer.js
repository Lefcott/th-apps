/** @format */

import React, { useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import RestaurantsDrawerEmptyState from './views/EmptyState';
import { isEmpty } from 'lodash';
import { RestaurantContext } from '../../contexts/RestaurantContext';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import EditableRestaurantList from './views/EditableRestaurantsList';
import DiningDrawer, {
  DiningDrawerCloseConfirmation,
  DiningDrawerFooter,
  DiningDrawerFooterAction,
} from '../DiningDrawer';
import { sendPendoEvent } from '@teamhub/api';
import { v4 } from 'uuid';
import Strings from '../../constants/strings';

function createRestaurantTemplate() {
  return {
    clientGuid: v4(),
    _id: null,
    name: '',
    careSettings: [],
  };
}

export default function RestaurantsDrawer({ open, onClose }) {
  const [newRestaurants, setNewRestaurants] = React.useState([]);
  const [currentView, setCurrentView] = React.useState('RestaurantsList');
  const [shouldShowConfirmation, setShouldShowConfirmation] = React.useState(
    false
  );
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    restaurants,
    loading: loadingRestaurants,
    refetch: refetchRestaurants,
  } = React.useContext(RestaurantContext);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  useEffect(() => {
    if (
      currentView == 'RestaurantsList' &&
      !restaurants.length &&
      !newRestaurants.length &&
      !loadingRestaurants
    ) {
      setCurrentView('EmptyState');
    } else if (
      (restaurants.length || newRestaurants.length) &&
      !loadingRestaurants
    ) {
      setCurrentView('RestaurantsList');
    }
  }, [restaurants, newRestaurants, currentView]);

  function removeNewRestaurantByIndex(index) {
    setNewRestaurants(newRestaurants.filter((_, idx) => idx !== index));
  }

  function handleNew() {
    switch (currentView) {
      case 'EmptyState':
        sendPendoEvent(Strings.Dining.pendoEvent.restaurant.setupAdd);
        break;
      default:
        sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editAdd);
    }

    setNewRestaurants([createRestaurantTemplate(), ...newRestaurants]);
  }

  function handleClose() {
    if (shouldShowConfirmation && !showConfirmation) {
      sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editClose);
      setShowConfirmation(true);
    } else {
      switch (currentView) {
        case 'EmptyState':
          sendPendoEvent(Strings.Dining.pendoEvent.restaurant.setupCancel);
          break;
        default:
          if (shouldShowConfirmation) {
            sendPendoEvent(
              Strings.Dining.pendoEvent.restaurant.editCloseConfirm
            );
          } else {
            sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editClose);
          }
      }

      onClose();
      setNewRestaurants([]);
      setShowConfirmation(false);
    }
  }

  function getView() {
    switch (currentView) {
      case 'EmptyState':
        return <RestaurantsDrawerEmptyState />;
      case 'RestaurantsList':
        return (
          <EditableRestaurantList
            open={open}
            restaurants={restaurants}
            newRestaurants={newRestaurants}
            refetchRestaurants={refetchRestaurants}
            onClose={onClose}
            setShouldShowConfirmation={setShouldShowConfirmation}
            removeNewRestaurantByIndex={removeNewRestaurantByIndex}
          />
        );
    }
  }

  function footerRenderer() {
    return showConfirmation ? (
      <DiningDrawerCloseConfirmation
        onConfirm={handleClose}
        onCancel={() => {
          sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editCloseGoBack);
          setShowConfirmation(false);
        }}
        message={Strings.Dining.drawer.closeConfirmation}
        confirmText="Cancel"
        confirmColor="secondary"
      />
    ) : (
      <DiningDrawerFooter>
        <DiningDrawerFooterAction
          id="dining_drawer_closebtn"
          onClick={handleClose}
        >
          Close
        </DiningDrawerFooterAction>
      </DiningDrawerFooter>
    );
  }

  const IntegrationAlert = withStyles({
    root: {
      color: '#000',
      backgroundColor: '#FFE7A1',
      fontWeight: '500',
      fontSize: '14px',
    },
  })(Alert);

  return (
    <DiningDrawer
      id="DN_restaurant-drawer"
      open={open}
      onClose={handleClose}
      headerText="Setup Restaurants"
      footerRenderer={footerRenderer}
      footerActions={[
        {
          useOnClose: true,
          text: 'Close',
          variant: 'text',
        },
      ]}
      drawerAction={{
        text: 'Add',
        onClick: handleNew,
        disabled: !isEmpty(enabledDiningIntegrations),
      }}
    >
      {getView()}
      {!isEmpty(enabledDiningIntegrations) && (
        <Box style={{ position: 'absolute', bottom: '60px', zIndex: 1300 }}>
          <IntegrationAlert severity="warning">
            {' '}
            Dining integration enabled; Menus are read-only. Use your dining
            provider to update restaurant information.
          </IntegrationAlert>
        </Box>
      )}
    </DiningDrawer>
  );
}
