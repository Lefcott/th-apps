/** @format */

import React from 'react';
import BaseCell, { BaseCellValue } from './BaseCell';

export default function UserNameCell({ value, globalFilterValue }) {
  const { firstName, lastName, fullName, profileImage } = value.data;

  function getFullName() {
    return fullName || `${firstName} ${lastName}`;
  }

  const displayName = getFullName();
  const alt = `${displayName || 'new user'} avatar`;

  return (
    <BaseCell>
      <BaseCellValue searchWords={globalFilterValue}>
        {displayName}
      </BaseCellValue>
    </BaseCell>
  );
}
