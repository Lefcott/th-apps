/** @format */

import React from 'react';
import RRule from 'rrule';
import moment from 'moment-timezone';
import {
  isEqual,
  isNull,
  isNil,
  includes,
  find,
  get,
  set,
  isArray,
} from 'lodash';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormKeyboardDatePicker,
  FormKeyboardTimePicker,
  FormDropdown,
  FormCheckbox,
  FormTextfield,
} from '../../utils/formComponents';
import {
  repeatOptions,
  frequencyOptions,
  daysOfWeekOptions,
} from '../../utils/componentData';
import {
  Event,
  Schedule as Clock,
  OpenInNew as LinkIcon,
} from '@material-ui/icons';
import { Header, HeaderName, CheckboxContainer } from '../styleUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import strings from '../../constants/strings';
import { generateSignupsEndDateTime } from '../../utils/helpers';

function useIsCustomRule(rule) {
  const [isCustom, setIsCustom] = React.useState(false);

  React.useEffect(() => {
    if (rule) {
      if (
        (rule.interval && rule.byweekday) ||
        rule.bysetpos ||
        rule.interval > 1
      ) {
        setIsCustom(true);
      } else {
        setIsCustom(false);
      }
    }
  }, [rule]);

  return isCustom;
}

export default function Schedule(props) {
  const {
    values,
    errors,
    setFieldValue,
    editRecurring,
    touched,
    disabled,
  } = props;
  const { rule } = values;
  const singleInRecurring = !editRecurring && values.recurring;
  const isShowOnTvToggled = get(values, 'showOnTv', false);
  const videoSourceType = get(values, 'videoSource.type', null);
  const isCustom = useIsCustomRule(rule);
  const hasRuleError = (field) =>
    errors['rule'] && errors['rule'][field] ? true : false;

  const hasError = (field) => errors[field] && touched[field];

  const getRepeatVal = () => {
    if (rule) {
      if (singleInRecurring) {
        return 'doesNotRepeat';
      }
      if (isCustom) {
        return 'custom';
      }
      switch (rule.freq) {
        case RRule.DAILY:
          return rule.count ? 'doesNotRepeat' : 'repeatDaily';
        case RRule.WEEKLY:
          return 'repeatWeekly';
        case RRule.MONTHLY:
          return 'repeatMonthly';
        default:
          return 'doesNotRepeat';
      }
    }
    return 'doesNotRepeat';
  };

  const getCustomFreq = () =>
    get(
      find(frequencyOptions, (opt) => isEqual(opt.id, rule.freq)),
      'id',
    );

  const getCustomFreqOptions = () =>
    frequencyOptions
      .filter((opt) => includes(['MONTHLY', 'WEEKLY', 'DAILY'], opt.value))
      .reverse();

  const getCustomDays = () =>
    daysOfWeekOptions.filter((opt) => {
      return find(rule.byweekday, (obj) =>
        isEqual(get(obj, 'weekday'), opt.id),
      );
    });

  const getNumberWithOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const startOnChange = (date) => {
    if (moment(date).isValid()) {
      setFieldValue('startDate', date);
    } else {
      setFieldValue('startDate', null);
    }
  };

  const signupsEndDateOnChange = (date) => {
    const signupsEnd = generateSignupsEndDateTime(date, values.signupsEndTime);
    setFieldValue('signupsEndDate', signupsEnd);
  };

  const signupsEndTimeOnChange = (time) => {
    const signupsEnd = generateSignupsEndDateTime(values.signupsEndDate, time);
    setFieldValue('signupsEndTime', time);
    setFieldValue('signupsEndDate', signupsEnd);
  };

  const handleTimeChange = (date, name) => {
    if (name === 'start') {
      setFieldValue('startTime', date);
    } else if (name === 'end') {
      if (moment(date).isValid()) {
        const startMin =
          values.startTime.hours() * 60 + values.startTime.minutes();
        const endMin = moment(date).hours() * 60 + moment(date).minutes();
        setFieldValue('duration', endMin - startMin);
      }
    }
  };

  const allDayChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFieldValue('startTime', moment(values.startTime).startOf('day'));
      setFieldValue(
        'duration',
        moment(values.startTime)
          .endOf('day')
          .diff(moment(values.startTime).startOf('day'), 'minutes'),
      );
    }
    setFieldValue('allDay', isChecked);
  };

  const repeatChange = ({ target: { value } }) => {
    switch (value) {
      case 'doesNotRepeat':
        setFieldValue('rule', null);
        setFieldValue('nthDates', []);
        break;
      case 'repeatDaily':
        setFieldValue('rule', { freq: RRule.DAILY, wkst: RRule.SU });
        setFieldValue('nthDates', []);
        break;
      case 'repeatWeekly':
        setFieldValue('rule', { freq: RRule.WEEKLY, wkst: RRule.SU });
        setFieldValue('nthDates', []);
        break;
      case 'repeatMonthly':
        setFieldValue('rule', { freq: RRule.MONTHLY, wkst: RRule.SU });
        setFieldValue('nthDates', []);
        break;
      case 'custom':
        setFieldValue('rule', {
          byweekday: [],
          wkst: RRule.SU,
          interval: 1,
        });
        break;
      default:
        return null;
    }
  };

  const endDateChange = (date) => {
    let updatedRule = { ...rule };
    if (isNull(date)) {
      delete updatedRule.until;
    } else {
      const isValidDate = moment(date).isValid();
      if (isValidDate) {
        updatedRule.until = moment(date).endOf('day').toDate();
      }
    }
    setFieldValue('rule', updatedRule);
  };

  const setCustomInterval = ({ target: { value } }) => {
    set(rule, 'interval', value);
    setFieldValue('rule', rule);
  };

  const setCustomFreq = ({ target: { value } }) => {
    delete rule.bysetpos;
    set(rule, 'freq', value);
    set(rule, 'interval', rule.interval || 1);
    // if we are moving to a new freq, change to an empty array
    if (value === RRule.MONTHLY || value === RRule.WEEKLY) {
      set(rule, 'byweekday', [RRule.MO]);
    } else if (value === RRule.DAILY) {
      set(rule, 'byweekday', []);
    }
    setFieldValue('rule', rule);
    setFieldValue('nthDates', []);
  };
  const setCustomDaysOfWeek = ({ target: { value } }) => {
    if (value === '') return;
    const existingRule = { ...rule };
    existingRule.byweekday = value;
    setFieldValue('rule', existingRule);
  };

  const setNthDate = ({ target: { value } }) => {
    setFieldValue('nthDates', value);
  };
  return (
    <Grid
      container
      spacing={3}
      style={{ padding: '0 25px' }}
      alignItems="flex-start"
      direction="column"
    >
      <Grid item container alignItems="flex-start" spacing={3}>
        <Grid item xs={12}>
          <Header>
            <HeaderName
              heading={strings.Event.scheduling.title}
              icon={
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ marginRight: '10px' }}
                />
              }
            />
          </Header>
        </Grid>
      </Grid>

      <Grid item container alignItems="flex-start" spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormKeyboardDatePicker
            name="startDate"
            required={true}
            disabled={disabled}
            label={strings.Event.inputs.startDate}
            id="Em_event_startDateInput"
            clearable={false}
            iconbutton={<Event id="Em_event_startDateIcon" />}
            value={values.startDate}
            onChange={(date) => startOnChange(date, 'day')}
            error={hasError('startDate')}
            helperText={hasError('startDate') && errors.startDate}
            format="MM/DD/YYYY"
          />
        </Grid>
      </Grid>

      <Grid item container alignItems="flex-start" spacing={3}>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <FormKeyboardTimePicker
            required
            label={strings.Event.inputs.startTime}
            id="Em_event_startTimeInput"
            format="hh:mm A"
            name="startTime"
            mask="__:__ _M"
            iconbutton={<Clock id="Em_event_startTimeBtn" />}
            disabled={values['allDay'] || disabled}
            value={values['startTime']}
            onChange={(date) => handleTimeChange(date, 'start')}
            error={hasError('startTime')}
            helperText={hasError('startTime') && errors['startTime']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <FormKeyboardTimePicker
            required
            label={strings.Event.inputs.endTime}
            name="endTime"
            id="Em_event_endTimeInput"
            format="hh:mm A"
            mask="__:__ _M"
            iconbutton={<Clock id="Em_event_endTimeBtn" />}
            disabled={values['allDay'] || disabled}
            value={moment(values['startTime']).add(
              values['duration'],
              'minutes',
            )}
            onChange={(date) => handleTimeChange(date, 'end')}
            error={hasError('duration')}
            helperText={hasError('duration') && errors['duration']}
          />
        </Grid>
        {!isShowOnTvToggled && (
          <CheckboxContainer
            item
            xs={12}
            sm={12}
            lg={4}
            style={{ marginTop: '20px' }}
          >
            <FormCheckbox
              name="allDay"
              label={strings.Event.inputs.allDay}
              value={values['allDay']}
              checked={values['allDay']}
              disabled={disabled}
              onChange={allDayChange}
            />
          </CheckboxContainer>
        )}
      </Grid>

      {videoSourceType && (
        <Grid item container alignItems="flex-start" spacing={3}>
          <Grid xs={12} sm={6} item style={{ paddingTop: 0, paddingBottom: 0 }}>
            <VideoHelperArea videoSourceType={videoSourceType} />
          </Grid>
        </Grid>
      )}

      <Grid item container alignItems="flex-start" spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormDropdown
            disabled={singleInRecurring || disabled}
            name="repeat"
            label={strings.Event.inputs.repeatOptions}
            value={getRepeatVal()}
            onChange={repeatChange}
          >
            <MenuItem value="" disabled>
              - {` ${strings.Event.select} `} -
            </MenuItem>
            {repeatOptions.map((opt) => (
              <MenuItem key={opt.id} value={opt.value}>
                {opt.text}
              </MenuItem>
            ))}
          </FormDropdown>
        </Grid>
        {rule && !singleInRecurring && (
          <Grid item xs={12} sm={6}>
            <FormKeyboardDatePicker
              name="rule.until"
              label={strings.Event.inputs.endDate}
              id="Em_event_endDateInput"
              clearable
              format="MM/DD/YYYY"
              iconbutton={<Event id="Em_event_endDateIcon" />}
              disabled={(rule && !!rule.count) || singleInRecurring || disabled}
              onChange={endDateChange}
              value={(rule && rule['until']) || null}
              initialFocusedDate={values.startDate}
            />
          </Grid>
        )}
      </Grid>

      {((rule && isCustom) || getRepeatVal() === 'custom') && (
        <Grid item container alignItems="flex-start" spacing={3}>
          {rule && isCustom && (
            <Grid item xs={12} sm={6}>
              <FormTextfield
                required
                name="repeatInterval"
                type="number"
                label={`${strings.Event.inputs.repeatEvery}:`}
                disabled={singleInRecurring || disabled}
                inputProps={{ step: 1 }}
                value={rule['interval']}
                error={hasRuleError('interval')}
                helperText={hasRuleError('interval') && errors.rule.interval}
                onChange={setCustomInterval}
              />
            </Grid>
          )}
          {getRepeatVal() === 'custom' && (
            <Grid item xs={12} sm={6}>
              <FormDropdown
                required
                name="repeatFrequency"
                label={strings.Event.inputs.frequency}
                disabled={singleInRecurring || disabled}
                value={getCustomFreq()}
                onChange={setCustomFreq}
                error={hasRuleError('freq')}
                helperText={hasRuleError('freq') && errors.rule.freq}
              >
                <MenuItem value="" disabled>
                  - {` ${strings.Event.select} `} -
                </MenuItem>
                {getCustomFreqOptions().map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.text}
                  </MenuItem>
                ))}
              </FormDropdown>
            </Grid>
          )}
        </Grid>
      )}

      {rule && (
        <Grid item container alignItems="flex-start" spacing={3}>
          {includes([RRule.MONTHLY], rule.freq) && isArray(rule.byweekday) ? (
            <Grid item xs={12} sm={rule.freq === 1 ? 6 : 12}>
              <FormDropdown
                name="occuringOn"
                disabled={singleInRecurring || disabled}
                label={strings.Event.inputs.occurringOnThe}
                value={values.nthDates}
                onChange={setNthDate}
                SelectProps={{
                  multiple: true,
                  renderValue: () =>
                    values.nthDates.map(getNumberWithOrdinal).join(', '),
                }}
              >
                <MenuItem value="" disabled>
                  - {` ${strings.Event.select} `} -
                </MenuItem>
                {[1, 2, 3, 4, 5].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <FormCheckbox checked={values.nthDates.includes(opt)} />
                    {getNumberWithOrdinal(opt)}
                  </MenuItem>
                ))}
              </FormDropdown>
            </Grid>
          ) : null}

          {(rule.interval || isArray(rule.bysetpos)) &&
            includes([1, 2], rule.freq) && (
              <Grid item xs={12} sm={rule.freq === 1 ? 6 : 12}>
                <FormDropdown
                  required
                  name="byweekday"
                  label={strings.Event.inputs.repeatsOn}
                  disabled={singleInRecurring || disabled}
                  value={getCustomDays().map(({ value }) => value)}
                  SelectProps={{
                    multiple: true,
                    renderValue: () =>
                      getCustomDays()
                        .map((obj) => obj.text)
                        .join(', '),
                  }}
                  onChange={setCustomDaysOfWeek}
                  error={hasRuleError('byweekday')}
                  helperText={
                    hasRuleError('byweekday') && errors.rule.byweekday
                  }
                >
                  <MenuItem value="" disabled>
                    - {` ${strings.Event.select} `} -
                  </MenuItem>
                  {daysOfWeekOptions.map((opt, index) => (
                    <MenuItem key={index} value={opt.value}>
                      <FormCheckbox
                        checked={!isNil(find(getCustomDays(), ['id', opt.id]))}
                      />
                      {opt.text}
                    </MenuItem>
                  ))}
                </FormDropdown>
              </Grid>
            )}
        </Grid>
      )}

      {getRepeatVal() === 'doesNotRepeat' &&
        (!values.recurring || singleInRecurring) && (
          <Grid item container alignItems="flex-start" spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormKeyboardDatePicker
                name="signupsEndDate"
                required={false}
                disabled={disabled}
                label={strings.Event.inputs.signupsEndDate}
                maxDate={values.startDate}
                minDate={moment()}
                id="Em_event_signupsEndDateInput"
                clearable={true}
                iconbutton={<Event id="Em_event_signupsEndDateIcon" />}
                value={values.signupsEndDate}
                onChange={(date) => signupsEndDateOnChange(date)}
                error={hasError('signupsEndDate')}
                helperText={hasError('signupsEndDate') && errors.signupsEndDate}
                format="MM/DD/YYYY"
              />
            </Grid>
            {values.signupsEndDate && (
              <Grid item xs={12} sm={6}>
                <FormKeyboardTimePicker
                  label={strings.Event.inputs.signupsEndTime}
                  name="signupsEndTime"
                  id="Em_event_signupsEndTimeInput"
                  format="hh:mm A"
                  mask="__:__ _M"
                  iconbutton={<Clock id="Em_event_endTimeBtn" />}
                  value={values.signupsEndTime}
                  onChange={(date) => signupsEndTimeOnChange(date)}
                  error={
                    hasError('signupsEndTime') || hasError('signupsEndDate')
                  }
                  helperText={
                    hasError('signupsEndTime') && errors['signupsEndTime']
                  }
                />
              </Grid>
            )}
          </Grid>
        )}
    </Grid>
  );
}

function VideoHelperArea({ videoSourceType }) {
  if (videoSourceType === 'DVD') {
    return (
      <Typography
        color="textSecondary"
        style={{ fontSize: '12px' }}
        variant="body1"
      >
        {strings.Event.videoHelperText}
      </Typography>
    );
  }

  return <SchedulingInstructionsModal />;
}

function SchedulingInstructionsModal() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Typography
        variant="body1"
        style={{ fontSize: '14px', padding: '8px 0px', cursor: 'pointer' }}
        color="primary"
        id="EM_virtualEvents-video-scheduling-help-instructions"
        onClick={() => setOpen(true)}
      >
        {strings.Event.scheduling.viewVideoInstructions}
      </Typography>
      <Dialog
        id="EM_virtualEvents-video-scheduling-help-dialog"
        onClose={() => setOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={open}
        PaperProps={{
          style: {
            maxWidth: '330px',
            paddingRight: '4px',
          },
        }}
      >
        <DialogTitle disableTypography>
          <Typography
            component="h2"
            variant="h5"
            id="simple-dialog-title"
            onClose={() => setOpen(false)}
          >
            {strings.Event.scheduling.videoInstructions}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText component={'p'}>
            {strings.Event.scheduling.videoLongerThanEvent}
          </DialogContentText>
          <DialogContentText component={'p'}>
            {strings.Event.scheduling.videoShorterThanEvent}
          </DialogContentText>

          <Box display="flex" alignItems="center">
            <Typography
              style={{ textDecoration: 'none' }}
              color="primary"
              variant="body1"
              component="a"
              id="EM_virtualEvents-video-scheduling-support-article"
              href="https://support.k4connect.com/knowledgebase/video-and-dvd-scheduling-faqs/"
              target="_blank"
            >
              {strings.Event.scheduling.viewSupportArticle}
            </Typography>
            <LinkIcon
              color="primary"
              style={{ paddingLeft: '8px', fontSize: '1rem' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" variant="text">
            {strings.Buttons.done}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
