/** @format */
import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export default function BaseTableTabs({ tabOptions }) {
  const style = {
    textTransform: 'capitalize',
    minWidth: '100px',
  };

  return (
    <Tabs
      key={tabOptions.value}
      value={tabOptions.value}
      onChange={tabOptions.onChange}
      indicatorColor="primary"
      textColor="primary"
      aria-label="icon label tabs example"
    >
      {tabOptions.tabs
        .filter((x) => !x.hidden)
        .map(({ value, label }) => (
          <Tab key={value} value={value} label={label} style={style} />
        ))}
    </Tabs>
  );
}
