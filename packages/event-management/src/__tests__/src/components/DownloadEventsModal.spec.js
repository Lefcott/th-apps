/** @format */

import React from 'react';
import {
  render,
  act,
  screen,
  within,
  waitForElementToBeRemoved,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadEventsModal, {
  FilenameFormatByTimeRangeType,
} from '../../../components/DownloadEventsModal';
import { TimeRangeType } from '../../../components/DownloadEventsTimeRangeTypeSelector';
import { floorToLocalWeek } from '../../../components/DownloadEventsTimeRangeSelector';

import createProvider from '../../test-utils/createProvider';
import wait from 'waait';
import { DateTime } from 'luxon';
import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({
  ...jest.requireActual('file-saver'),
  saveAs: jest.fn(),
}));

const communityId = '2476';
const currentDate = DateTime.local();
describe('Calendar Preview', () => {
  let spyLocal;

  const EM = {
    ListItem: 'EM_download-to-word-list-item',
    Modal: 'EM_download-events-modal',
    DownLoadBtn: 'EM_download-events-button',
    CalendarFilterControl: 'EM_calendar-filter-control',
    CalendarFilter: 'EM_calendar-filter',
    TimeRangeTypeFilterControl: 'EM_timerangetype-filter-control',
    TimeRangeTypeFilter: 'EM_timerangetype-filter',
    TimeRangeFilter: 'EM_timerange-filter',
    FieldOptionsCheckBox: 'EM_fieldOptions-control',
    CheckBoxWrapper: 'EM_fieldOptions-control',
    CheckBoxDayOfWeek: 'EM_fieldOptions-dayOfWeek-checkbox',
    CheckBoxPeriod: 'EM_fieldOptions-period-checkbox',
    CheckBoxEndTime: 'EM_fieldOptions-endTime-checkbox',
    CheckBoxLocation: 'EM_fieldOptions-location-checkbox',
    CheckBoxDescription: 'EM_fieldOptions-description-checkbox',
    ControlLabelDayOfWeek: 'EM_fieldOptions-dayOfWeek-controlLabel',
    ControlLabelPeriod: 'EM_fieldOptions-period-controlLabel',
    ControlLabelEndTime: 'EM_fieldOptions-endTime-controlLabel',
    ControlLabelLocation: 'EM_fieldOptions-location-controlLabel',
    ControlLabelDescription: 'EM_fieldOptions-description-controlLabel',
    PreviewWrapper: 'EM_eventpreview',
    PreviewTitle: 'EM_eventpreview-title',
    PreviewDayOfWeek: 'EM_eventpreview-dayofweek',
    PreviewDate: 'EM_eventpreview-date',
    PreviewStartTime: 'EM_eventpreview-starttime',
    PreviewEndTime: 'EM_eventpreview-endtime',
    PreviewName: 'EM_eventpreview-name',
    PreviewLocation: 'EM_eventpreview-location',
    PreviewDescription: 'EM_eventpreview-description',
  };

  const clickDownloadDoc = async () => {
    await act(async () => {
      await userEvent.click(await screen.getByTestId(EM.DownLoadBtn));
      await screen.findByText('Download');
    });
  };

  const setupRender = async () => {
    await act(async () => {
      const TestProvider = createProvider({
        routerProps: {
          initialentries: [`/?communityId=${communityId}`],
        },
      });

      render(<DownloadEventsModal />, {
        wrapper: TestProvider,
      });
      await wait(1000);
    });
    userEvent.click(await screen.findByTestId(EM.ListItem));
  };

  beforeAll(() => {
    spyLocal = jest.spyOn(DateTime, 'local').mockReturnValue(currentDate);
  });

  afterEach(cleanup);

  afterAll(() => {
    spyLocal.restoreMock();
  });

  beforeEach(async () => {
    // apollo = [getCalendarsRequest, getEventLocationsRequest];
    saveAs.mockClear();
  });

  it('should render the ListItem component', async () => {
    await setupRender();
    const ListItem = screen.getByTestId(EM.ListItem);
    expect(ListItem).toBeInTheDocument();
  });

  it('should open modal when the user clicks the list item', async () => {
    await setupRender();
    expect(screen.getByTestId(EM.Modal)).toBeInTheDocument();
  });

  it('should close modal when the user clicks cancel', async () => {
    await setupRender();
    const cancelBtn = screen.getByText(/cancel/i);
    await act(async () => {
      userEvent.click(cancelBtn);
    });
    await waitForElementToBeRemoved(cancelBtn);
    expect(screen.queryByTestId(EM.Modal)).not.toBeInTheDocument();
  });

  it('should download event doc when a user clicks the download document button', async () => {
    await setupRender();
    expect(screen.getByTestId(EM.DownLoadBtn)).toBeInTheDocument();
    await clickDownloadDoc();

    expect(saveAs).toHaveBeenCalled();
  });

  describe('Calendar', () => {
    it('should be able to deselect all calendars', async () => {
      await setupRender();

      await act(async () => {
        userEvent.click(await screen.findByText(/All Calendars/));
      });

      const options = await screen.findAllByRole('option');

      const allOption = options[0];

      await act(async () => {
        await userEvent.click(allOption);
      });

      options.forEach((option) => {
        expect(option).not.toHaveAttribute('aria-selected');
      });

      expect(
        (await screen.findAllByLabelText('Calendars'))[0],
      ).not.toHaveValue();

      await clickDownloadDoc();
      expect(saveAs).toHaveBeenCalledTimes(1);
    });

    it('should show a calendar filter with All Calendars chosen', async () => {
      await setupRender();
      await act(async () => {
        userEvent.click(await screen.findByText(/All Calendars/));
        await wait(1000);
      });

      const options = await screen.findAllByRole('option');
      const allOption = options.shift();
      const { getByRole } = within(allOption);
      expect(getByRole('all-selection-checkbox').className).toMatch(
        /Mui-checked/i,
      );
      options.forEach((option) => {
        expect(option).toHaveAttribute('aria-selected');
      });
    });

    it('should uncheck individual calendar', async () => {
      await setupRender();
      const { getByRole, getByText } = within(
        screen.getByTestId(EM.CalendarFilter),
      );
      await wait(100);
      const button = getByRole('button');
      await act(async () => {
        userEvent.click(button);
      });
      const options = await screen.findAllByRole('option');
      const allCalendarOption = options[0];
      const firstCalendarOption = options[1];
      expect(firstCalendarOption).toHaveAttribute('aria-selected');

      await act(async () => {
        await userEvent.click(firstCalendarOption);
      });

      expect(allCalendarOption).not.toHaveAttribute('aria-selected');
      expect(firstCalendarOption).not.toHaveAttribute('aria-selected');

      await act(async () => {
        userEvent.click(button);
      });

      expect(getByText(/Spirituality/)).toBeInTheDocument();
    });

    it('should able to check individual calendar', async () => {
      await setupRender();
      const { getByRole, getByText } = within(
        screen.getByTestId(EM.CalendarFilter),
      );
      await wait(100);
      const button = getByRole('button');

      await act(async () => {
        userEvent.click(button);
      });
      const options = await screen.findAllByRole('option');
      const allCalendarOption = options[0];
      const firstCalendarOption = options[1];

      await act(async () => {
        await userEvent.click(allCalendarOption);
      });

      options.forEach((option) => {
        expect(option).not.toHaveAttribute('aria-selected');
      });

      await act(async () => {
        userEvent.click(firstCalendarOption);
        userEvent.click(button);
      });

      expect(getByText(/Wellness/)).toBeInTheDocument();
    });
  });

  describe('TimeRange', () => {
    it('should show time range selection for current and next two months', async () => {
      let expectedFilename;
      await setupRender();

      const nextMonth = currentDate.plus({ months: 1 });
      const twoMonthsFromNow = currentDate.plus({ months: 2 });

      // select next months
      expectedFilename = nextMonth.toFormat(
        FilenameFormatByTimeRangeType[TimeRangeType.MONTH],
      );

      userEvent.click(await screen.findByText(currentDate.monthLong));
      userEvent.click(await screen.findByText(nextMonth.monthLong));
      await screen.findByText(nextMonth.monthLong);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select two months from now
      expectedFilename = twoMonthsFromNow.toFormat(
        FilenameFormatByTimeRangeType[TimeRangeType.MONTH],
      );
      userEvent.click(await screen.findByText(nextMonth.monthLong));
      userEvent.click(await screen.findByText(twoMonthsFromNow.monthLong));
      await screen.findByText(twoMonthsFromNow.monthLong);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select this month
      expectedFilename = currentDate.toFormat(
        FilenameFormatByTimeRangeType[TimeRangeType.MONTH],
      );
      userEvent.click(await screen.findByText(twoMonthsFromNow.monthLong));
      userEvent.click(await screen.findByText(currentDate.monthLong));
      await screen.findByText(currentDate.monthLong);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );
    });

    it('should show time range selection for this week and next week', async () => {
      let expectedFilename;

      await setupRender();

      const { findByText } = within(
        await screen.findByTestId(EM.TimeRangeTypeFilterControl),
      );

      // select week time range type
      expectedFilename = `Week of ${floorToLocalWeek(currentDate).toFormat(
        FilenameFormatByTimeRangeType[TimeRangeType.WEEK],
      )}`;

      await act(async () => {
        userEvent.click(await findByText(/Month/));
        userEvent.click(await screen.findByText(/^Week/));
      });
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select next week
      expectedFilename = `Week of ${floorToLocalWeek(
        currentDate.plus({ weeks: 1 }),
      ).toFormat(FilenameFormatByTimeRangeType[TimeRangeType.WEEK])}`;

      await act(async () => {
        userEvent.click(await screen.findByText(/This Week/));
        userEvent.click(await screen.findByText(/Next Week/));
      });
      await screen.findByText(/Next Week/);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select this week
      expectedFilename = `Week of ${floorToLocalWeek(currentDate).toFormat(
        FilenameFormatByTimeRangeType[TimeRangeType.WEEK],
      )}`;

      await act(async () => {
        userEvent.click(await screen.findByText(/Next Week/));
        userEvent.click(await screen.findByText(/This Week/));
      });
      await screen.findByText(/This Week/);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );
    });

    it('should show time range selection today or tomorrow', async () => {
      let expectedFilename;
      await setupRender();

      const { findByText } = within(
        await screen.findByTestId(EM.TimeRangeTypeFilterControl),
      );

      // select day time range type
      expectedFilename = currentDate
        .startOf('day')
        .toFormat(FilenameFormatByTimeRangeType[TimeRangeType.DAY]);
      await act(async () => {
        userEvent.click(await findByText(/Month/));
        userEvent.click(await screen.findByText(/^Day$/));
      });
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select tomorrow
      expectedFilename = currentDate
        .plus({ days: 1 })
        .startOf('day')
        .toFormat(FilenameFormatByTimeRangeType[TimeRangeType.DAY]);
      await act(async () => {
        userEvent.click(await screen.findByText(/Today/));
        userEvent.click(await screen.findByText(/Tomorrow/));
      });
      await screen.findByText(/Tomorrow/);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );

      // select today
      expectedFilename = currentDate
        .startOf('day')
        .toFormat(FilenameFormatByTimeRangeType[TimeRangeType.DAY]);
      await act(async () => {
        userEvent.click(await screen.findByText(/Tomorrow/));
        userEvent.click(await screen.findByText(/Today/));
      });
      await screen.findByText(/Today/);
      await clickDownloadDoc();
      expect(saveAs).toHaveBeenLastCalledWith(
        expect.anything(),
        `${expectedFilename}.docx`,
      );
    });
  });

  describe('EventFieldOptions', () => {
    beforeEach(async () => {
      await setupRender();
    });

    afterEach(cleanup);

    it('it should render event options selector', async () => {
      const optionsCheckbox = await screen.findByTestId(EM.CheckBoxWrapper);
      expect(optionsCheckbox).toBeInTheDocument();
    });

    it('should hide and show description', () => {
      const option = screen.getByTestId(EM.ControlLabelDescription);
      expect(screen.getByTestId(EM.PreviewDescription));

      userEvent.click(option);
      expect(
        screen.queryByTestId(EM.PreviewDescription),
      ).not.toBeInTheDocument();

      userEvent.click(option);
      expect(screen.getByTestId(EM.PreviewDescription)).toBeInTheDocument();
    });

    it('should hide and show day period', () => {
      const option = screen.getByTestId(EM.ControlLabelPeriod);
      const {
        getByText: getByTextStartDate,
        queryByText: queryByTextStartDate,
      } = within(screen.getByTestId(EM.PreviewStartTime));
      const { getByText: getByTextEndDate, queryByText: queryByTextEndDate } =
        within(screen.getByTestId(EM.PreviewEndTime));

      expect(getByTextStartDate(/.*AM/)).toBeInTheDocument();
      expect(getByTextEndDate(/.*PM/)).toBeInTheDocument();

      userEvent.click(option);
      expect(queryByTextStartDate(/.*AM/)).not.toBeInTheDocument();
      expect(queryByTextEndDate(/.*PM/)).not.toBeInTheDocument();

      userEvent.click(option);
      expect(getByTextStartDate(/.*AM/)).toBeInTheDocument();
      expect(getByTextEndDate(/.*PM/)).toBeInTheDocument();
    });

    it('should hide and show event end time', () => {
      const option = screen.getByTestId(EM.ControlLabelEndTime);
      expect(screen.getByTestId(EM.PreviewEndTime)).toBeInTheDocument();

      userEvent.click(option);
      expect(screen.queryByTestId(EM.PreviewEndTime)).not.toBeInTheDocument();

      userEvent.click(option);
      expect(screen.getByTestId(EM.PreviewEndTime)).toBeInTheDocument();
    });

    it('should hide and show location name', () => {
      const option = screen.getByTestId(EM.ControlLabelLocation);
      expect(screen.getByTestId(EM.PreviewLocation)).toBeInTheDocument();

      userEvent.click(option);
      expect(screen.queryByTestId(EM.PreviewLocation)).not.toBeInTheDocument();

      userEvent.click(option);
      expect(screen.getByTestId(EM.PreviewLocation)).toBeInTheDocument();
    });

    it('should hide and show location name', () => {
      const option = screen.getByTestId(EM.ControlLabelLocation);
      expect(screen.getByTestId(EM.PreviewLocation)).toBeInTheDocument();

      userEvent.click(option);
      expect(screen.queryByTestId(EM.PreviewLocation)).not.toBeInTheDocument();

      userEvent.click(option);
      expect(screen.getByTestId(EM.PreviewLocation)).toBeInTheDocument();
    });

    it('should hide and show day of the week', () => {
      const option = screen.getByTestId(EM.ControlLabelDayOfWeek);
      expect(screen.getByTestId(EM.PreviewDayOfWeek)).toBeInTheDocument();

      userEvent.click(option);
      expect(screen.queryByTestId(EM.PreviewDayOfWeek)).not.toBeInTheDocument();

      userEvent.click(option);
      expect(screen.getByTestId(EM.PreviewDayOfWeek)).toBeInTheDocument();
    });
  });
});
