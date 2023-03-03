/** @format */

import React from 'react';
import './SwipeableItem.css';
import styled from '@emotion/styled';
import Swipeout from 'rc-swipeout';

const Icon = styled.img`
  width: 30px;
  padding-bottom: 5px;
`;

const button = (name, action, swipeProperties, data) => {
  const badge = (
    <div>
      <Icon src={swipeProperties.icon} />
      <div>{name}</div>
    </div>
  );
  const obj = {
    text: badge,
    onPress: () => action(data),
    style: swipeProperties.style,
  };
  return obj;
};

const SwipeableItem = ({ listItemActions, children, data, ...props }) => (
  <Swipeout
    autoClose
    right={listItemActions.reduce((filtered, item) => {
      if (item.position === 'right') {
        const { name, action, swipeProperties } = item;
        const obj = button(name, action, swipeProperties, data);
        filtered.push(obj);
      }
      return filtered;
    }, [])}
  >
    {children}
  </Swipeout>
);

export default SwipeableItem;
