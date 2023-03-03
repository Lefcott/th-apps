import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@material-ui/core";

export const DropdownSelect = (props) => (
  <FormControl {...props.controlprops} variant={props.variant}>
    <InputLabel {...props.inputlabelprops}>{props.label}</InputLabel>
    <Select {...props} value={props.value} onChange={props.onChange}>
      {props.children}
    </Select>
    {props.helperText ? (
      <FormHelperText>{props.helperText}</FormHelperText>
    ) : null}
  </FormControl>
);

export const FormDropdown = ({ value, ...props }) => {
  const defaultInputLabelProps =
    props?.inputlabelprops?.defaultShrink === false ? {} : { shrink: true };
  return (
    <DropdownSelect
      {...props}
      value={value || ""}
      inputlabelprops={{ ...defaultInputLabelProps, ...props.inputlabelprops }}
      controlprops={{ ...props, fullWidth: true }}
      displayEmpty
    />
  );
};
