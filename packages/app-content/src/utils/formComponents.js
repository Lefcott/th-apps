/** @format */

import React, { useState, useRef } from 'react';
import { includes, isUndefined } from 'lodash';
import {
  Button,
  Chip,
  Box,
  IconButton,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormHelperText,
  Divider,
} from '@material-ui/core';
import { Check, Clear, ControlPoint } from '@material-ui/icons';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';

const formSelectUseStyles = makeStyles((theme) => ({
  root: {
    maxHeight: theme.spacing(15),
    overflow: 'auto',
  },
  select: {
    whiteSpace: 'inherit',
  },
}));

/** @format */

const formSelectMenuProps = {
  variant: 'menu',
  anchorOrigin: {
    horizontal: 'left',
    vertical: 'bottom',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
  getContentAnchorEl: null,
};

const WhiteBackgroundMenuItem = withStyles(() => ({
  selected: {
    backgroundColor: 'white !important',
  },
}))(MenuItem);

export const FormActionButton = ({ label, ...props }) => (
  <Button
    color="primary"
    startIcon={<ControlPoint />}
    style={{ textTransform: 'capitalize' }}
    {...props}
  >
    {label}
  </Button>
);

export const FormTextfield = ({ value, inputProps = {}, ...props }) => {
  delete inputProps.helperText;
  if (!isUndefined(inputProps.error)) {
    inputProps.error = inputProps.error.toString();
  }

  return (
    <Box mb={3} mt={3} style={{ width: '100%' }}>
      <TextField
        {...props}
        fullWidth
        value={value || ''}
        inputProps={inputProps}
        InputLabelProps={{ ...props.InputLabelProps, shrink: true }}
      />
    </Box>
  );
};

const HidableIconButton = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: theme.spacing(1),
    right: 0,
    display: 'block',
    '&.hidden': {
      display: 'none',
      marginTop: theme.spacing(1),
    },
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))(IconButton);

const ClosableFormTextField = ({
  value = '',
  onClose,
  boxStyling,
  multiline,
  ...props
}) => {
  const [val, setVal] = useState(value);
  const [hide, setHide] = useState(true);
  const [focus, setFocus] = useState(false);

  const setValue = (event) => {
    if (props.onChange) {
      props.onChange(event);
    }
    setVal(event.target.value);
  };

  const onClear = () => {
    setVal('');
    setValue({
      target: {
        name: props.name,
        value: '',
      },
    });
    onClose();
  };

  const icon = multiline ? (
    <Button
      size="small"
      onClick={onClear}
      color={focus ? 'primary' : 'default'}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      data-testid={`${props.id}-clear-button`}
      style={{
        position: 'absolute',
        display: hide ? 'none' : '',
        right: 0,
        top: '-4px',
        fontSize: '12px',
        textTransform: 'none',
        fontWeight: 'normal',
        padding: 0,
      }}
    >
      Remove
    </Button>
  ) : (
    <div
      style={{
        position: 'relative',
        display: hide ? 'none' : '',
        width: '40px',
      }}
    >
      <HidableIconButton
        edge="end"
        onClick={onClear}
        data-testid={`${props.id}-clear-button`}
      >
        <Clear />
      </HidableIconButton>
    </div>
  );

  return (
    <Box
      mb={3}
      mt={3}
      display="flex"
      position="relative"
      alignItems="flex-start"
      style={boxStyling || {}}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setHide(false)}
      onMouseLeave={() => setHide(true)}
    >
      <TextField
        {...props}
        multiline
        fullWidth
        value={val}
        onChange={setValue}
        InputLabelProps={{ shrink: true }}
        InputProps={{ 'data-testid': `${props.id}-input-text` }}
      />
      {icon}
    </Box>
  );
};

//tag creator thing
export const ClearableFormTextField = withStyles(() => ({
  root: {},
}))(ClosableFormTextField);

//tcustom tag selector component
const filter = createFilterOptions();
const CreateableChips = ({ values = [], options, onChange, ...props }) => {
  const { classes } = props;

  const mapOptions = (options) =>
    options.map((opt) => {
      return opt.name ? opt : { name: opt };
    });
  const mapValues = (values) =>
    values.map((val) => {
      return val.name ? val : { name: val };
    });
  const tagFilterOptions = (options, params) => {
    params.inputValue = params.inputValue.trim();
    const filtered = filter(options, params);
    const existingTags = options.map((o) => o.name);

    if (
      params.inputValue !== '' &&
      !includes(existingTags, params.inputValue.trim())
    ) {
      filtered.push({
        inputValue: params.inputValue,
        name: `Create "${params.inputValue}" folder`,
        new: true,
      });
    }

    return filtered;
  };
  //pass in fetched values from props
  return (
    <Autocomplete
      options={mapOptions(options)}
      value={mapValues(values)}
      classes={classes}
      multiple
      disableClearable
      noOptionsText={props.noOptionsText}
      renderOption={(option) => {
        if (option.new) {
          return (
            <Typography data-testid="AP_postmodal-create-tag" color="primary">
              {option.name}
            </Typography>
          );
        } else {
          return <Typography>{option.name}</Typography>;
        }
      }}
      getOptionSelected={(option, value) =>
        option.name === (value.inputValue || value.name)
      }
      defaultValue={[]}
      filterOptions={tagFilterOptions}
      onChange={onChange}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderInput={(params) => {
        params.inputProps = { ...params.inputProps, ...props.inputProps };
        return (
          <FormTextfield
            {...params}
            id={props.id}
            error={props.error}
            color="primary"
            variant="outlined"
            label="Folders"
            placeholder="Enter folder"
            InputLabelProps={props.InputLabelProps}
            helperText={params.inputProps.helperText}
          />
        );
      }}
    />
  );
};

//tag creator thing
export const CustomTagCreator = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
}))(CreateableChips);

//multi chip select
export const MultiSelectChip = (props) => {
  const { item, selected } = props;

  const MultiChip = withStyles((theme) => ({
    root: {
      display: 'inline-flex',
      margin: '15px 10px 0 0',
      '&.selected': {
        color: theme.palette.primary.main,
        background: 'rgba(76, 67, 219, 0.1)',
        '& .MuiChip-icon': {
          color: theme.palette.primary.main,
          fontSize: '15px',
        },
      },
    },
  }))(Chip);

  return (
    <MultiChip
      {...props}
      selected={selected}
      className={selected ? 'selected' : ''}
      icon={selected ? <Check /> : undefined}
      label={item.name}
    />
  );
};

/** @format */

export function FormSelect({
  id,
  label,
  multiple,
  onChange,
  options,
  value,
  selectAllOptionDisplayText,
  valueRenderer,
  variant,
  error,
  helperText,
  breakWord,
  labelBackgroundColor,
}) {
  const formSelectClasses = formSelectUseStyles();
  const ALL_OPTIONS = '__all__';
  const labelRef = useRef();
  const selectRef = useRef();
  const [open, setOpen] = useState(false);
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;
  const selectHeight = selectRef.current ? selectRef.current.clientHeight : 0;

  const getId = (componentName) => `${id}-${componentName}`;

  const handleChange = (ev) => {
    let finalValue = [];
    const value = ev.target.value;
    const allSelected = value.length > options.length;

    if (multiple && value.includes(ALL_OPTIONS)) {
      finalValue = allSelected ? [] : options.map((item) => item.value);
      return onChange(finalValue);
    }

    finalValue = value;
    onChange(finalValue);
  };

  const getRenderValue = (value) => {
    if (!value || (Array.isArray(value) && !value.length)) return '';
    // This handles the options shown in the input separated by commas and such
    if (multiple) {
      const allSelected = value?.length === options?.length;

      if (selectAllOptionDisplayText && allSelected) {
        return (
          <Typography display="block" variant="body1">
            {selectAllOptionDisplayText}
          </Typography>
        );
      }

      const displayValue = Array.isArray(value) ? value : [value];

      if (valueRenderer) {
        return value.length
          ? displayValue.map((val, i) => valueRenderer(val, i, value))
          : '';
      } else {
        displayValue.map((val) => (
          <div key={val}>
            <Typography display="block" variant="body1">{`${val},`}</Typography>
          </div>
        ));
      }
    } else {
      return valueRenderer ? valueRenderer(value) : value;
    }
  };

  const getSelectAllOption = () => {
    // This handles the dropdown option "All resident groups" and its checked/uncheked state
    const isAllChecked = value?.length === options?.length;

    return (
      <MenuItem
        id={getId('option-all')}
        divider
        value={ALL_OPTIONS}
        style={
          breakWord ? { whiteSpace: 'unset', wordBreak: 'break-all' } : null
        }
      >
        {multiple && (
          <Checkbox
            id={getId('checkbox-all')}
            role="all-selection-checkbox"
            checked={isAllChecked}
            style={{ marginRight: 8 }}
            onChange={() => null}
            color="primary"
          />
        )}
        {selectAllOptionDisplayText}
      </MenuItem>
    );
  };

  const getOptionItem = (option) => {
    const optionId = option.id.toString().toLowerCase().replace(/\s+/g, '_');

    return (
      <WhiteBackgroundMenuItem
        id={getId(`option-${optionId}`)}
        key={option.id}
        value={option.value}
        style={
          breakWord
            ? {
                marginRight: 16,
                whiteSpace: 'unset',
                wordBreak: 'break-all',
              }
            : null
        }
      >
        {multiple && (
          <Checkbox
            id={getId(`checkbox-${optionId}`)}
            checked={option.getChecked(value, option)}
            style={{ marginRight: 8 }}
            onChange={() => null}
            color="primary"
          />
        )}
        <span>{`${option.displayText}`}</span>
      </WhiteBackgroundMenuItem>
    );
  };

  const inputProps = {
    id: getId('input'),
    'data-testid': getId('input'),
  };

  return (
    <FormControl
      fullWidth
      id={getId('control')}
      data-testid={getId('control')}
      style={breakWord ? { wordBreak: 'break-all' } : null}
      // variant='outlined'
    >
      <InputLabel
        ref={labelRef}
        shrink={true}
        htmlFor={getId('input')}
        variant={variant}
        id={getId('label')}
        style={
          labelBackgroundColor
            ? { backgroundColor: labelBackgroundColor }
            : null
        }
      >
        {label}
      </InputLabel>
      <Select
        id={getId('select')}
        fullWidth
        variant={variant}
        classes={formSelectClasses}
        height={300}
        data-testid={id}
        labelId={getId('label')}
        labelWidth={labelWidth}
        multiple={multiple}
        open={open}
        value={value}
        displayEmpty={true}
        onChange={handleChange}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        renderValue={getRenderValue}
        inputProps={inputProps}
        error={error}
        helperText={helperText}
        ref={selectRef}
        MenuProps={
          breakWord
            ? {
                ...formSelectMenuProps,
                PaperProps: {
                  ...formSelectMenuProps.PaperProps,
                  style: {
                    ...formSelectMenuProps.PaperProps.style,
                    maxWidth: 'min-content',
                    paddingRight: selectHeight > 120 ? 18 : 0, // input max height is 120px
                  },
                },
              }
            : formSelectMenuProps
        }
      >
        {multiple && getSelectAllOption()}
        {options.map((option) => getOptionItem(option))}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
}
