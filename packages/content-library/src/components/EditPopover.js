import React, { useState } from 'react';
import styled from '@emotion/styled';
import { isEqual, isEmpty } from 'lodash';
import {
  Popper,
  TextField,
  IconButton,
  ClickAwayListener,
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import { showToast, showErrorToast } from '@teamhub/toast';
import { getCommunityId } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';
import { RENAME_CONTENT } from '../graphql/content';

const StyledPopper = styled(Popper)`
  border-radius: 10px;
  box-shadow: 0px 0px 6px 1px #b3b3b3;
  background-color: #ffffff;
  padding: 10px 5px 10px 10px;
`;

const NameField = styled(TextField)`
  && {
    width: 200px;
    margin-right: 5px;
  }
`;

const Text = styled.span`
  font-size: 14px;
  margin-right: 5px;
  color: #474848;
`;

const Button = styled(IconButton)`
  && {
    padding: 5px;
  }
`;

function EditPopover(props) {
  const {
    anchorEl,
    action,
    onClose,
    content,
    refetch,
    sliderRefs,
    sectionKey,
  } = props;
  const [name, setName] = useState('');
  const communityId = getCommunityId();
  const [renameContent] = useMutation(RENAME_CONTENT);

  const checkOnClick = () => {
    if (isEqual(action, 'rename')) return renameSubmit();
  };

  const renameSubmit = () => {
    renameContent({
      variables: { communityId, contentId: content._id, name: name.trim() },
    })
      .then(() => {
        showToast('Your content was successfully renamed');
        refetch();
        if (sliderRefs[sectionKey]) {
          sliderRefs[sectionKey].slickGoTo(0);
        }
      })
      .catch((err) => console.warn(err));
    onClose();
  };

  return (
    <ClickAwayListener onClickAway={onClose}>
      <StyledPopper
        open={true}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1200 }}
      >
        {isEqual(action, 'rename') ? (
          <NameField
            autoFocus
            value={name}
            placeholder="New name"
            className="CL_card-popoverName"
            onChange={({ target }) => setName(target.value)}
          />
        ) : (
          <Text>
            Deleting this will permanently remove it from the library. You
            cannot undo this action
          </Text>
        )}
        <Button
          className="CL_card-popoverSubmit"
          onClick={checkOnClick}
          disabled={isEqual(action, 'rename') ? isEmpty(name) : false}
        >
          <Check fontSize="small" />
        </Button>
        <Button className="CL_card-popoverCancel" onClick={onClose}>
          <Close fontSize="small" />
        </Button>
      </StyledPopper>
    </ClickAwayListener>
  );
}

export default EditPopover;
