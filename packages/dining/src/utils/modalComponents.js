/** @format */

import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const DialogRoot = withStyles({
	paperWidthXs: {
		maxWidth: '400px',
	},
})(Dialog);

const DialogHeader = withStyles((theme) => ({
	root: {
		'& h2': {
			fontSize: '20px',
			color: theme.palette.text.highEmphasis,
		},
	},
}))(DialogTitle);

export function ConfirmationModal({
	title,
	content,
	open,
	onClose,
	rightButtonLabel,
	leftButtonLabel,
	leftButtonHandler,
	leftButtonDisabled = false,
	rightButtonHandler,
	leftButtonVariant,
	rightButtonVariant = 'primary',
	rightButtonDisabled = false,
	classes = {}
}) {
	return (
		<DialogRoot open={open} onClose={onClose} maxWidth={'xs'} classes={{ paper: classes.root }}>
			<DialogHeader className={classes.header}> {title} </DialogHeader>
			<DialogContent className={classes.content}>
				<DialogContentText className={classes.contentText}>
					{content}
				</DialogContentText>
			</DialogContent>
			<DialogActions className={classes.actions}>
				<Button
					onClick={leftButtonHandler}
					color={leftButtonVariant}
					disabled={leftButtonDisabled}
          className={classes.leftButton}
				>
					{leftButtonLabel || 'CANCEL'}
				</Button>
				<Button
					onClick={rightButtonHandler}
					color={rightButtonVariant}
					disabled={rightButtonDisabled}
          className={classes.rightButton}
				>
					{rightButtonLabel || 'OK'}
				</Button>
			</DialogActions>
		</DialogRoot>
	);
}
