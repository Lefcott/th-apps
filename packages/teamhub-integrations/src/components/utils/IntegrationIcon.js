import React from "react";
import { Avatar, Typography } from "@material-ui/core";

export default function IntegrationIcon({
  integrationName,
  integrationIcon,
  ...props
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        ...props.style,
      }}
    >
      <Avatar
        variant="square"
        style={{ marginRight: "10px" }}
        alt={integrationName}
        src={integrationIcon}
      />
      <Typography variant="subtitle1" style={{ fontWeight: "500" }}>
        {integrationName}
      </Typography>
    </div>
  );
}
