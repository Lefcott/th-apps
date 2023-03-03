/** @format */

import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import BaseCell, { BaseCellValue } from "./BaseCell";

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    paddingLeft: theme.spacing(0.25),
    fontSize: theme.spacing(2.25),
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginRight: theme.spacing(2),
  },
  colorDefault: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function UserNameCell({ value, globalFilterValue }) {
  const { firstName, lastName, fullName } = value.data;
  const avatarClasses = useAvatarStyles();
  function getInitials() {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  function getFullName() {
    return fullName || `${firstName} ${lastName}`;
  }

  const initials = getInitials();
  const displayName = getFullName();
  const alt = `${displayName || "new user"} avatar`;

  return (
    <BaseCell>
      <Avatar classes={avatarClasses} alt={alt}>
        {initials}
      </Avatar>
      <BaseCellValue searchWords={globalFilterValue}>
        {displayName}
      </BaseCellValue>
    </BaseCell>
  );
}
