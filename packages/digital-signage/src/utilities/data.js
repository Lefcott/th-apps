/** @format */

import alphaDown from '../assets/icons/sort-alpha-down.svg';
import alphaUp from '../assets/icons/sort-alpha-up.svg';
import amountDown from '../assets/icons/sort-amount-down.svg';
import amountUp from '../assets/icons/sort-amount-up.svg';

export const sortItems = [
  {
    name: 'Edited Date: Desc',
    value: 'updatedAt:desc',
    icon: amountDown,
  },
  {
    name: 'Edited Date: Asc',
    value: 'updatedAt:asc',
    icon: amountUp,
  },
  {
    name: 'By name: A-Z',
    value: 'name:asc',
    icon: alphaDown,
  },
  {
    name: 'By name: Z-A',
    value: 'name:desc',
    icon: alphaUp,
  },
];
