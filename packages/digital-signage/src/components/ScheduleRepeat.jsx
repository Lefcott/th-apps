/** @format */

import React, { useEffect, useReducer } from 'react';
import {
  Grid,
  FormLabel,
  FormGroup,
  FormHelperText,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import moment from 'moment-timezone';
import RRule from 'rrule';

const reducer = (oldState, newState) => ({ ...oldState, ...newState });

// this function serves to ensure that our selected value
// in step 4 persists based on the state of the rule
function determineOption(freq, byweekday) {
  switch (freq) {
    case 1:
      return byweekday ? 'dayOfMonth' : 'monthly';
    case 2:
      return 'weekly';
    case 3:
      return 'daily';
    default:
      console.error('No match between frequency and options');
  }
}

function assignExistingChecks(freq, byweekday) {
  if (freq === 2 && Array.isArray(byweekday)) {
    return new Map(byweekday.map((wd) => [wd, true]));
  }

  return new Map();
}

export default function ScheduleRepeat(props) {
  const { rule } = props.values;
  const [state, setState] = useReducer(reducer, {
    selectedOption: determineOption(rule.freq, rule.byweekday),
    checkedItems: assignExistingChecks(rule.freq, rule.byweekday),
    weekFreq: rule.interval ? rule.interval : 1,
    repeatOptions: [],
  });

  const { values, errors, setFieldValue } = props;
  const hasError = errors['rule'] && errors['rule'].byweekday;

  function loadOptions() {
    const startDate = moment(rule.dtstart);
    const weekNum = `${Math.ceil(startDate.date() / 7)}`;
    const weekDays = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth',
      5: 'fifth',
    };
    const weekString = weekDays[weekNum];
    setState({
      repeatOptions: [
        {
          name: 'Daily',
          value: 'daily',
        },
        {
          name: 'Weekly',
          value: 'weekly',
        },
        {
          name: `Every ${weekString} ${moment(startDate).format(
            'dddd',
          )} of the month`,
          value: 'dayOfMonth',
        },
        {
          name: `Monthly on the ${startDate.format('Do')}`,
          value: 'monthly',
        },
      ],
    });
  }

  async function onDropdownChange({ target }) {
    const { value } = target;
    const { weekFreq } = state;
    const startDate = moment(rule.dtstart);
    const dayOfWeek = startDate.format('dddd');
    let updatedRule = { ...rule };

    switch (value) {
      case 'daily':
        updatedRule.freq = RRule.DAILY;
        delete updatedRule.interval;
        delete updatedRule.byweekday;
        delete updatedRule.bysetpos;
        break;
      case 'monthly':
        updatedRule.freq = RRule.MONTHLY;
        delete updatedRule.interval;
        delete updatedRule.byweekday;
        delete updatedRule.bysetpos;
        break;
      case 'weekly':
        // determine checked boxes
        const selected = Array.from(state.checkedItems)
          .filter((entry) => entry[1])
          .map((item) => item[0]);
        updatedRule.freq = RRule.WEEKLY;

        selected.length > 0
          ? (updatedRule.byweekday = selected)
          : delete updatedRule.byweekday;
        updatedRule.interval = weekFreq;
        delete updatedRule.bysetpos;
        break;
      case 'dayOfMonth':
        updatedRule.freq = RRule.MONTHLY;
        // the result of dayObj[dayOfWeek] is going to be an obj, but we want to
        // put it into an array to pass Yup validation
        updatedRule.byweekday = [dayObj[dayOfWeek]];
        updatedRule.bysetpos = Math.ceil(startDate.date() / 7);
        delete updatedRule.interval;
        break;
      default:
        return;
    }

    if (value !== 'weekly') {
      setState({ selectedOption: value, checkedItems: new Map(), weekFreq: 1 });
    } else {
      setState({ selectedOption: value });
    }
    setFieldValue('rule', updatedRule);
  }

  function onCheck(value, checked) {
    const { checkedItems } = state;
    const newChecked = checkedItems.set(value, checked);
    let selected = Array.from(newChecked)
      .filter((entry) => {
        return entry[1];
      })
      .map((item) => item[0]);
    let updatedRule = { ...rule };
    if (selected.length > 0) {
      updatedRule.byweekday = selected;
    } else {
      delete updatedRule.byweekday;
    }
    setFieldValue('rule', updatedRule);
    setState(checkedItems);
  }

  function weekFreqChange({ target }) {
    const { value } = target;
    setState({ weekFreq: value });
    setFieldValue('rule', { ...rule, interval: parseInt(value) });
  }

  // because the options are formatted
  // we load them on componentdidmount when we can be assured
  // props exist
  useEffect(() => {
    loadOptions();
  }, []);

  const { selectedOption, checkedItems, weekFreq } = state;

  const daysHidden = selectedOption !== 'weekly';

  return (
    <Grid container style={{ margin: '15px 0' }}>
      <Grid item xs={12}>
        <TextField
          name="selectedOption"
          label="Repeat"
          value={selectedOption}
          onChange={onDropdownChange}
          select
          fullWidth
        >
          {state.repeatOptions.map((opt) => (
            <MenuItem key={opt.name} value={opt.value}>
              {opt.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid hidden={daysHidden} item style={{ marginTop: 10 }} xs={12}>
        <TextField
          label="Every"
          value={weekFreq}
          onChange={weekFreqChange}
          select
          fullWidth
        >
          {weekOptions.map((opt, index) => (
            <MenuItem key={opt.label} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid
        item
        hidden={daysHidden}
        style={{ marginBottom: '15px', marginTop: '15px' }}
        xs={12}
      >
        <FormLabel labelPlacement="top">On the following days</FormLabel>
        <FormGroup required row>
          {checkboxes.map((item) => (
            <FormControlLabel
              key={item.value}
              label={item.label}
              control={
                <Checkbox
                  color="primary"
                  checked={checkedItems.get(item.value)}
                  // note here we pass item.value NOT THE EVENT TARGET VALUE
                  // if you use the event's value the object is converted to a string
                  // and is useless
                  onChange={({ target }) => onCheck(item.value, target.checked)}
                />
              }
            />
          ))}
        </FormGroup>
        {hasError ? (
          <FormHelperText style={{ color: '#cc4c3b' }}>
            {hasError}
          </FormHelperText>
        ) : null}
      </Grid>
    </Grid>
  );
}

let weekOptions = [
  { label: 'Week', value: 1 },
  { label: 'Two Weeks', value: 2 },
  { label: 'Three Weeks', value: 3 },
  { label: 'Four Weeks', value: 4 },
  { label: 'Five Weeks', value: 5 },
];

const dayObj = {
  Monday: RRule.MO,
  Tuesday: RRule.TU,
  Wednesday: RRule.WE,
  Thursday: RRule.TH,
  Friday: RRule.FR,
  Saturday: RRule.SA,
  Sunday: RRule.SU,
};

const checkboxes = [
  {
    value: RRule.SU,
    label: 'Sunday',
  },
  {
    value: RRule.MO,
    label: 'Monday',
  },
  {
    value: RRule.TU,
    label: 'Tuesday',
  },
  {
    value: RRule.WE,
    label: 'Wednesday',
  },
  {
    value: RRule.TH,
    label: 'Thursday',
  },
  {
    value: RRule.FR,
    label: 'Friday',
  },
  {
    value: RRule.SA,
    label: 'Saturday',
  },
];
