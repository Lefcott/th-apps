/** @format */

import React from 'react';
import { Box, Button, TextField, useMediaQuery } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  useCurrentUser,
  setSelectedCommunity,
  navigate,
  updateAuthStatus,
} from '@teamhub/api';
import { useHistory } from 'react-router-dom';

export default function CommunitySelector(props) {
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:960px)');
  const [selected, setSelected] = React.useState(null);
  const [user, loading] = useCurrentUser({
    onCompleted: (user) => {
      if (!user) {
        return history.push('/');
      }

      const { communities } = user;
      if (communities.length === 1) {
        const defaultCommunity = communities[0];
        setSelectedCommunity(defaultCommunity._id);
        updateAuthStatus({ selectedCommunity: defaultCommunity._id });
        navigate(`/?communityId=${defaultCommunity._id}`);
      }
    },
  });

  const sortCommunities = (communities) =>
    communities.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    // set selected community and navigate to the first page
    setSelectedCommunity(selected._id);
    updateAuthStatus({ selectedCommunity: selected._id });
    navigate(`/?communityId=${selected._id}`);
  };
  return (
    <form
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        height: isMobile ? 'auto' : '100%',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
      onSubmit={handleSubmit}
      data-testid="TA_community-selector_container"
    >
      <Autocomplete
        fullWidth
        label="Community"
        style={{ padding: '10px' }}
        value={selected}
        variant="outlined"
        id="TA_community-selector_autocomplete"
        data-testid="TA_community-selector_autocomplete"
        options={
          user && user.communities ? sortCommunities(user.communities) : []
        }
        getOptionLabel={(opt) => opt.name}
        getOptionSelected={(option, value) => option._id === value._id}
        onChange={(_, value) => setSelected(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Community"
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      />

      <Box flexGrow={isMobile ? 0 : 1} mt={isMobile && 2}></Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button
          color="primary"
          type="submit"
          variant="contained"
          data-testid="TA_community-selector_submit"
          disabled={!selected}
        >
          Go
        </Button>
      </Box>
    </form>
  );
}
