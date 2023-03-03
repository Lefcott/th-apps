/** @format */
import React from 'react';
import { List } from '@material-ui/core';
import EditableRestaurantListItem from './EditableRestaurantsListItem';

export default function EditableRestaurantList({
  open,
  restaurants,
  newRestaurants,
  onClose,
  removeNewRestaurantByIndex,
  setShouldShowConfirmation,
  refetchRestaurants,
}) {
  const [dirtyStates, setDirtyStates] = React.useState({});
  const [names, setNames] = React.useState({});

  function setFormState(guid, value) {
    if (dirtyStates[guid] !== value) {
      const nextState = { ...dirtyStates };
      nextState[guid] = value;
      setDirtyStates(nextState);
    }
  }

  function setFormName(guid, value) {
    const nextNames = { ...names };
    nextNames[guid] = value;
    setNames(nextNames);
  }

  React.useEffect(() => {
    if (!names.length) {
      const nextNames = allRestaurants.reduce((total, curr) => {
        total[curr._id || curr.clientGuid] = curr.name;
        return total;
      }, {});
      setNames(nextNames);
    }
  }, [allRestaurants]);

  React.useEffect(() => {
    const isExistingDirty = Object.values(dirtyStates).find((s) => s);
    const isAddingNewRestaurants = newRestaurants.length;
    setShouldShowConfirmation(isExistingDirty || isAddingNewRestaurants);
  }, [dirtyStates, newRestaurants]);

  const allRestaurants = [...newRestaurants, ...restaurants];

  return (
    <List>
      {allRestaurants.map((restaurant, index) => (
        <EditableRestaurantListItem
          open={open}
          key={restaurant._id || restaurant.clientGuid}
          index={index}
          names={names}
          onClose={onClose}
          setFormState={setFormState}
          setFormName={setFormName}
          restaurant={restaurant}
          restaurants={restaurants}
          refetchRestaurants={refetchRestaurants}
          removeNewRestaurantByIndex={removeNewRestaurantByIndex}
        />
      ))}
    </List>
  );
}
