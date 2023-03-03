/** @format */

import React from 'react';
import { render, act, screen } from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import BasicInfo from '../../../components/EventInfo/BasicInfo';

describe('Basic Info', () => {
  // Event Info
  const EI = {
    BasicInfoHead: 'EI_basic-info-header',
    BasicInfoEventName: 'EI_basic-info-event-name-text-field',
    BasicInfoEventLocation: 'EI_basic-info-event-location-dropdown',
    BasicInfoEventCal: 'EI_basic-info-event-cal-text-field',
    BasicInfoEventStatusDropDown: 'EI_basic-info-event-status-dropdown',
    BasicInfoEventStatusArchive: 'EI_basic-info-event-status-archive',
    BasicInfoEventStatusDraft: 'EI_basic-info-event-status-draft',
    BasicInfoEventStatusPub: 'EI_basic-info-event-status-published',
  };

  const initialValues = {
    _id: 'new',
    name: '',
    location: null,
    eventType: null,
    numSpots: null,
    calendars: [
      {
        _id: 'd1dcca20-4450-4436-add7-325954bcb412',
        name: "Esly's Calendar",
        priority: 11,
        __typename: 'EventCalendar',
      },
    ],
    rule: {
      count: 1,
      wkst: { weekday: 6 },
      freq: 3,
      duration: 60,
      timezone: 'America/New_York',
      dtstart: '2020-07-24T12:00:24.801Z',
    },
    allDay: false,
    hiddenOn30: false,
    hiddenOn7: false,
    hiddenOn1: false,
    noWrap: false,
    hideEndTime: true,
    costsMoney: false,
    description: '',
  };

  const setUpRender = async (props) => {
    props.filters = {
      eventCalendars: [
        {
          _id: 'd1dcca20-4450-4436-add7-325954bcb412',
          name: "Esly's Calendar",
          priority: 11,
          __typename: 'EventCalendar',
        },
      ],
      eventTypes: [
        {
          _id: 987654321,
          name: 'Unassigned',
          color: '#000',
          __typename: 'EventType',
        },
        {
          _id: 298,
          name: 'Basement',
          color: '#943d3d',
          __typename: 'EventType',
        },
      ],
      eventLocations: [
        {
          _id: 1355,
          name: 'Scary Basement',
          abbr: 'BT',
          color: '#80097e',
          __typename: 'EventLocation',
        },
      ],
      __typename: 'Community',
    };

    props.errors = {};
    props.touched = {};
    props.handleChage = jest.fn();

    await act(async () => {
      render(<BasicInfo {...props} />);
    });
  };

  const clickElm = async (element) => {
    await act(async () => {
      await userEvent.click(element);
      await wait(2000);
    });
  };

  it('should render basic info inputs', async () => {
    let basicProps = {
      initialValues,
      values: initialValues,
    };

    await setUpRender(basicProps);
    const BasicInfoHead = await screen.getByTestId(EI.BasicInfoHead);

    expect(BasicInfoHead).toBeInTheDocument();

    const BasicInfoEventName = await screen.getByTestId(EI.BasicInfoEventName);
    expect(BasicInfoEventName).toBeInTheDocument();

    const BasicInfoEventLocation = await screen.getByTestId(
      EI.BasicInfoEventLocation,
    );
    expect(BasicInfoEventLocation).toBeInTheDocument();

    const BasicInfoEventCal = await screen.getByTestId(EI.BasicInfoEventCal);
    expect(BasicInfoEventCal).toBeInTheDocument();

    const BasicInfoEventStatusDropDown = await screen.findByText(
      'Event Status',
    );
    expect(BasicInfoEventStatusDropDown).toBeInTheDocument();
  });

  xit('should render draft and publish as status when creating new record', async () => {
    const baseProps = {
      initialValues: initialValues,
      values: initialValues,
    };

    await setUpRender(baseProps);

    const BasicInfoEventStatusDropDown = await screen.findByText(
      'Event Status',
    );
    expect(BasicInfoEventStatusDropDown).toBeInTheDocument();

    await clickElm(BasicInfoEventStatusDropDown);

    // expect(await screen.findByText("Archive")).not.toBeInTheDocument();

    //const BasicInfoEventStatusDraft = await screen.getByTestId(EI.BasicInfoEventStatusDraft);
    const BasicInfoEventStatusDraft = await screen.findByDisplayValue(/Draft/i);
    expect(BasicInfoEventStatusDraft).toBeInTheDocument();

    const BasicInfoEventStatusPub = await screen.getByTestId(
      EI.BasicInfoEventStatusPub,
    );
    expect(BasicInfoEventStatusPub).toBeInTheDocument();
  });

  xit('should render archive, draft, and publish as status when creating new record', async () => {
    const existingRecord = {
      name: 'Intro to Beat Boxing (Canceled)',
      location: 1355,
      eventType: 70,
      totalSpots: 10,
      rule: {
        count: 1,
        wkst: { weekday: 6 },
        freq: 3,
        duration: '60',
        timezone: 'America/New_York',
        dtstart: '2020-07-23T00:00:21.000Z',
      },
      hiddenOn30: false,
      hiddenOn7: false,
      hiddenOn1: false,
      noWrap: false,
      hideEndTime: true,
      costsMoney: false,
      description:
        "Impress your loved ones during your next video call by dropping a sick beat. Pro's will be present to provide tips and lessons! Lessons will be held in the scary basement for the strong 8 mile vibes.",
      allDay: false,
      status: 'Published',
      calendars: [
        {
          _id: 'd1dcca20-4450-4436-add7-325954bcb412',
          name: "Esly's Calendar",
          __typename: 'EventCalendar',
        },
      ],
      numSpots: 10,
      openSpots: 10,
      startsAt: '2020-07-22T20:00:21.000-04:00',
      recurring: false,
      numSignups: 0,
    };

    const props = {
      intialValues: existingRecord,
      values: existingRecord,
    };

    await setUpRender(props);

    const BasicInfoEventStatusDropDown = await screen.findByText(
      'Event Status',
    );
    expect(BasicInfoEventStatusDropDown).toBeInTheDocument();

    await clickElm(BasicInfoEventStatusDropDown);

    // This might be bonked.
    const BasicInfoEventStatusArchive = await screen.getByTestId(
      EI.BasicInfoEventStatusArchive,
    );
    expect(BasicInfoEventStatusArchive).toBeInTheDocument();

    const BasicInfoEventStatusDraft = await screen.getByTestId(
      EI.BasicInfoEventStatusDraft,
    );
    expect(BasicInfoEventStatusDraft).toBeInTheDocument();

    const BasicInfoEventStatusPub = await screen.getByTestId(
      EI.BasicInfoEventStatusPub,
    );
    expect(BasicInfoEventStatusPub).toBeInTheDocument();
  });
});
