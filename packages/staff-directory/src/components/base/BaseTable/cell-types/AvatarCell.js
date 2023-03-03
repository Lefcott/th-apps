/** @format */

import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BaseCell, { BaseCellValue } from './BaseCell';

export const useAvatarStyles = makeStyles((theme) => ({
  root: (props) => ({
    padding: 0,
    paddingLeft: props.src ? 0 : theme.spacing(0.25),
    fontSize: theme.spacing(2.25),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginRight: theme.spacing(2),
  }),
  colorDefault: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function AvatarCell({ value }) {
  const { src, content, alt } = value.data;
  const avatarClasses = useAvatarStyles({ src: src });

  return (
    <BaseCell>
      <Avatar src={src} classes={avatarClasses} alt={alt}>
        {content}
      </Avatar>
    </BaseCell>
  );
}
