import React from "react";
import { TextField, Tooltip } from "@material-ui/core";

export default function TextFieldWithTooltip({
  title,
  props,
  showTooltip = false,
}) {
  return (
    <>
      {title && showTooltip ? (
        <Tooltip placement={"bottom"} title={title}>
          <TextField {...props} />
        </Tooltip>
      ) : (
        <TextField {...props} />
      )}
    </>
  );
}
