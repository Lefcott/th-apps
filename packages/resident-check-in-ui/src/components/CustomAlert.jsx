import { Alert } from "@material-ui/lab";
import styled from "@emotion/styled";

const CustomAlert = styled(Alert)`
  &&&& {
    border-radius: 3px;
    font-size: 12px;
    left: 0;
    margin: auto;
    position: ${(props) => (props.overlap ? "absolute" : "unset")};
    right: ${(props) => (props.overlap ? 0 : "unset")};
    top: ${(props) => (props.overlap ? "-22px" : "unset")};
    width: 85%;
    color: #474848;
    background-color: #fff;
    border-color: rgb(204, 204, 204);
  }
`;

export default CustomAlert;
