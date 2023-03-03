/** @format */

import React, { useState, useRef } from 'react';
import { Clear, ControlPoint } from '@material-ui/icons';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';
import { useFormikContext } from 'formik';

export const FormTextfield = ({ value, ...props }) => (
  <TextField
    variant="outlined" // default to outlined unless otherwise specified
    value={value || ''}
    fullWidth
    {...props}
  />
);

export const FormDropdown = ({ value, ...props }) => {
  return (
    <TextField
      select
      fullWidth
      value={value || ''}
      SelectProps={{
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          getContentAnchorEl: null,
        },
        ...props.SelectProps,
      }}
      variant="outlined"
      {...props}
    >
      {props.children}
    </TextField>
  );
};

export const FormKeyboardDatePicker = (props) => (
  <KeyboardDatePicker
    variant="outlined"
    fullWidth
    inputVariant="outlined"
    InputLabelProps={{ shrink: true }}
    keyboardIcon={props.iconbutton}
    InputProps={{ position: 'end' }}
    {...props}
  />
);

export const FormKeyboardTimePicker = (props) => (
  <KeyboardTimePicker
    fullWidth
    inputVariant="outlined"
    InputLabelProps={{ shrink: true }}
    keyboardIcon={props.iconbutton}
    InputProps={{ position: 'end', variant: 'outlined' }}
    {...props}
  />
);

export const FormCheckbox = (props) => (
  <FormControlLabel
    control={<Checkbox {...props} color="primary" />}
    label={props.label}
    style={props.style}
  />
);

export const Dropdown = ({ value, options, ...props }) => {
  let finalVal = '';
  //sometimes the value can be 0, so we need to check for that
  if (value || value === 0) {
    finalVal = value;
  }
  return (
    <TextField
      select
      fullWidth
      value={finalVal}
      // variant='outlined'
      {...props}
      InputLabelProps={{ shrink: true }}
    >
      {options && options.length > 0 ? (
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem>No options passed</MenuItem>
      )}
    </TextField>
  );
};

const HidableIconButton = withStyles((theme) => ({
  root: {
    display: 'block',
    '&.hidden': {
      display: 'none',
    },
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))(IconButton);

export const ClearableTextField = withStyles(() => ({ root: {} }))(
  ({ onClose, boxStyling, ...props }) => {
    const [hide, setHide] = useState(true);

    return (
      <Box
        mb={3}
        mt={3}
        display="flex"
        style={
          (boxStyling || {},
          {
            position: 'relative',
            marginBottom: '-2px',
          })
        }
        onMouseEnter={() => setHide(false)}
        onMouseLeave={() => setHide(true)}
      >
        <TextField
          {...props}
          fullWidth
          InputProps={{
            'data-testid': `${props.id}-input-text`,
            endAdornment: onClose ? (
              <HidableIconButton
                className={hide ? 'hidden' : ''}
                disabled={props.disabled}
                onClick={onClose}
                edge="end"
                data-testid={`${props.id}-clear-button`}
              >
                <Clear />
              </HidableIconButton>
            ) : null,
          }}
        />
      </Box>
    );
  },
);

ClearableTextField.defaultProps = {
  onClose: () => {},
};

const WhiteBackgroundMenuItem = withStyles(() => ({
  selected: {
    backgroundColor: 'white !important',
  },
}))(MenuItem);

const formSelectUseStyles = makeStyles((theme) => ({
  root: (props) => ({
    maxHeight: theme.spacing(15),
    overflow: 'auto',
    ...props,
  }),
}));

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

export function FormSelect({
  hasError,
  helperText,
  id,
  label,
  multiple,
  onChange,
  options,
  value,
  selectAllOptionDisplayText,
  valueRenderer,
  variant,
  breakWord,
  labelBackgroundColor,
  allCareSettingsOption,
  styleProps,
}) {
  const formSelectClasses = formSelectUseStyles(styleProps);
  const ALL_OPTIONS = '__all__';
  const labelRef = useRef();
  const selectRef = useRef();
  const [open, setOpen] = useState(false);
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;
  const selectHeight = selectRef.current ? selectRef.current.clientHeight : 0;

  const getId = (componentName) => `${id}-${componentName}`;

  const handleChange = (ev) => {
    // debugger
    let finalValue;
    const value = ev.target.value;

    if (multiple && value.includes(ALL_OPTIONS)) {
      const values = value.filter((el) => el !== ALL_OPTIONS);

      const isAllChecked =
        values.length === options.length ||
        (value.length === 1 && value[0]._id === allCareSettingsOption?._id);

      finalValue = isAllChecked ? [] : options.map((item) => item.value);
      return onChange(finalValue);
    }

    finalValue = ev.target.value;
    onChange(finalValue);
  };

  const getRenderValue = (value) => {
    // This handles the options shown in the input separated by commas and such
    if (multiple) {
      const allSelected =
        (value && value.length === options.length) ||
        (value.length === 1 && value[0]._id === allCareSettingsOption?._id);

      if (selectAllOptionDisplayText && allSelected) {
        return (
          <Typography display="block" variant="body1">
            {selectAllOptionDisplayText}
          </Typography>
        );
      }

      if (valueRenderer) {
        return value.map((val, i) => valueRenderer(val, i, value));
      } else {
        value.map((val) => (
          <div key={val._id}>
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
    const isChecked =
      value.length === options.length ||
      (value.length === 1 && value[0]._id === allCareSettingsOption?._id);

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
            checked={isChecked}
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
      error={hasError}
    >
      <InputLabel
        margin="dense"
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
        onChange={(ev) => handleChange(ev)}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        renderValue={getRenderValue}
        inputProps={inputProps}
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
                    paddingRight: selectHeight > 120 ? 16 : 0, // input max height is 120px
                  },
                },
              }
            : formSelectMenuProps
        }
      >
        {selectAllOptionDisplayText && getSelectAllOption()}
        {options.map((option) => getOptionItem(option))}
      </Select>
      <FormHelperText error={hasError}>{helperText}</FormHelperText>
    </FormControl>
  );
}

export const FormErrorListener = ({ onError }) => {
  const formik = useFormikContext();
  const [errors, setErrors] = React.useState(formik.errors);
  const [submitCount, setSubmitCount] = React.useState(formik.submitCount);

  React.useEffect(() => {
    if (
      submitCount !== formik.submitCount ||
      (!isEqual(errors, formik.errors) && !formik.dirty)
    ) {
      onError(formik.errors);
      setErrors(formik.errors);
      setSubmitCount(formik.submitCount);
    }
  }, [formik.submitCount, formik.errors]);

  return null;
};

export const FormActionButton = ({ label, startIcon, ...props }) => (
  <Button
    color="primary"
    startIcon={startIcon ? startIcon : <ControlPoint />}
    style={{ textTransform: 'capitalize' }}
    {...props}
  >
    {label}
  </Button>
);
