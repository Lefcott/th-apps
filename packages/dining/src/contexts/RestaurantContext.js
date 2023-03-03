/** @format */

import React from 'react';
import useRestaurants from '../hooks/useRestaurants';

export const RestaurantContext = React.createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, { loading, error, refetch, called }] = useRestaurants();
  const [currentRestaurant, setCurrentRestaurant] = React.useState(null);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        loading,
        error,
        refetch,
        called,
        currentRestaurant,
        setCurrentRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
