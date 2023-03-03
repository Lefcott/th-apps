import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Paper,
  Button,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  useMediaQuery,
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { cardActions } from '../utils/componentData';
import EditPopover from './EditPopover';
import { showToast, showErrorToast, closeToast } from '@teamhub/toast';
import { includes, isEqual, get } from 'lodash';
import { useMutation, useLazyQuery } from '@teamhub/apollo-config';
import { GET_SINGLE_CONTENT, PRINT_CONTENT } from '../graphql/content';
import DeleteModal from './DeleteModal';
import { buildCreatorUrl } from '../utils/url';
import { navigate, getCommunityId, useCurrentUser } from '@teamhub/api';

const OptionsButton = styled(Button)`
  && {
    min-width: 0;
    padding: 0;
    z-index: 1;
    background-color: #ffffff;
    color: #707070;
    opacity: 80%;
    border-radius: 20px;
    :hover {
      background-color: #e6e6e6;
    }
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 6px;
`;

const DropdownList = styled(MenuList)`
  box-shadow: 0px 0px 6px 1px #b3b3b3;
  border-radius: 10px;
`;

export const openModule = (name, content, toast) => {
  if (window.parent && window.parent.K4Community) {
    const dashboard = window.parent.K4Community.view;
    const controller = dashboard.content.contentViewController;
    controller.openModule(name, content);
  } else {
    toast('Unable to open design in the Creator', { variant: 'error' });
  }
};

function ButtonDropdown(props) {
  const { content, refetch, sliderRefs, sectionKey } = props;
  const [user] = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(null);
  const buttonRef = useRef(null);
  const [printContent] = useMutation(PRINT_CONTENT);
  const isTabletOrBelow = useMediaQuery('(max-width:960px)', { noSsr: true });

  const [loadContent, { data }] = useLazyQuery(GET_SINGLE_CONTENT, {
    skip: isTabletOrBelow,
    variables: {
      communityId: getCommunityId(),
      id: content._id,
    },
  });

  const visibleActions = cardActions.filter((action) => {
    if (!isTabletOrBelow) return true;
    return action.name !== 'editCreator';
  });

  const currentContent = get(data, 'community.content');

  useEffect(() => {
    if (dropdownOpen) {
      loadContent();
    }
  }, [dropdownOpen, loadContent]);

  const actionOnClick = async (name) => {
    setDropdownOpen(false);
    switch (name) {
      case 'rename':
        return setEditOpen(name);
      case 'editCreator':
        const url = buildCreatorUrl(currentContent, user);
        return navigate(url);
      case 'publishSignage':
        return navigate(
          `/signage?communityId=${getCommunityId('communityId')}&contentId=${
            content._id
          }`
        );
      case 'publishApp':
        return navigate(
          `/publisher/feed/post?communityId=${getCommunityId(
            'communityId'
          )}&contentId=${content._id}`
        );
      case 'print':
        return processPrint();
    }
  };

  const processPrint = () => {
    if (isEqual(content.docType, 'document'))
      return window.open(content.url, '_blank');
    const communityId = getCommunityId();
    const printSnackKey = showToast(
      'Your content is being prepared for print',
      { persist: true }
    );
    printContent({ variables: { communityId, contentId: content._id } })
      .then(({ data }) => {
        const contentUrl = data.community.content.print;
        window.open(contentUrl, '_blank');
        closeToast(printSnackKey);
      })
      .catch((err) => {
        closeToast(printSnackKey);
        console.warn(err);
      });
  };

  return (
    <ButtonContainer>
      <OptionsButton
        className="CL_card-menuList"
        ref={buttonRef}
        onClick={() => setDropdownOpen(true)}
      >
        <MoreHoriz fontSize="small" />
      </OptionsButton>
      <Popper
        open={dropdownOpen && (!!currentContent || isTabletOrBelow)}
        anchorEl={buttonRef.current}
        style={{ zIndex: 10 }}
        popperprops={{
          placement: 'top-end',
          style: { marginBottom: 5 },
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
            <DropdownList>
              {visibleActions.map(
                (action) =>
                  includes(action.accessible, content.docType) &&
                  (action.name === 'delete' ? (
                    <DeleteModal
                      key={action.name}
                      contentId={content._id}
                      refetch={refetch}
                      docType={content.docType}
                      closeDropdown={() => setDropdownOpen(false)}
                    />
                  ) : (
                    <MenuItem
                      key={action.name}
                      className={`CL_card-menuList-listItem CL_card-menuList-${action.name}`}
                      onClick={() => actionOnClick(action.name)}
                    >
                      {action.text}
                    </MenuItem>
                  ))
              )}
            </DropdownList>
          </ClickAwayListener>
        </Paper>
      </Popper>

      {editOpen && (
        <EditPopover
          anchorEl={buttonRef.current}
          action={editOpen}
          content={content}
          refetch={refetch}
          sliderRefs={sliderRefs}
          sectionKey={sectionKey}
          onClose={() => setEditOpen(null)}
        />
      )}
    </ButtonContainer>
  );
}

export default ButtonDropdown;
