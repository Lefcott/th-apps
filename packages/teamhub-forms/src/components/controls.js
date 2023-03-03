import styled from "@emotion/styled";
import ReactDOM from "react-dom";
import { Button } from "@material-ui/core";

export const StyledButton = styled(Button)`
  && {
    margin-left: ${(props) => (props.margin ? "15px" : 0)};
    font-size: 14px;
    padding: 5px 25px;
  }
`;

export function Portal(props) {
  const parent = document.getElementById("navbar-action-area");
  return ReactDOM.createPortal(props.children, parent);
}
