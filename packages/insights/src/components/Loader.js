import React from "react";
import { CircularProgress } from "@material-ui/core";

const ProgressStyle = {
  position: "absolute",
  width: "60px",
  height: "60px",
  left: "50%",
  top: "50%",
};

function Loader() {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <CircularProgress color="primary" style={ProgressStyle} />
    </div>
  );
}
export default Loader;
