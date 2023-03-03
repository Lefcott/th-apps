/** @format */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import WeekCalendar from '../components/WeekCalendar';
import FilterDrawer from '../components/FilterDrawer';
import { useMediaQuery } from '@material-ui/core';

const Wrapper = styled.div`
  display: flex;
  height: calc(100vh - 64px);

  @media (max-width: 960px) {
    flex-flow: column;
  }
`;

const CalContainer = styled.div`
  display: flex;
  flex-flow: row;
  flex: 1 1 auto;
  overflow: hidden;
  height: 100%;
`;

function CalendarPage() {
  const isMobile = useMediaQuery('(max-width:960px)', { noSsr: true });
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);

  return (
    <Wrapper>
      <CalContainer>
        <FilterDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <WeekCalendar
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </CalContainer>
    </Wrapper>
  );
}

export default CalendarPage;
