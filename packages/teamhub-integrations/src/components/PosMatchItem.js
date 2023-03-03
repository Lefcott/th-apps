import {
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { CheckCircle, House, Mail, Phone } from "@material-ui/icons";
import React, { useEffect } from "react";

const useItemStyles = makeStyles((theme) => ({
  subtitle: {
    fontSize: "14px",
    position: "relative",
    bottom: "5px",
  },
  secondaryIcon: {
    color: "#D7D5D5",
    position: "relative",
    top: "5px",
    right: "4px",
    fontSize: "1.25rem",
  },
  checkedItem: {
    background: "rgba(76, 67, 219, 0.12)",
  },
}));

export default function MatchItem(props) {
  const {
    id,
    vendorId,
    vendorIdKey,
    residentId,
    resident,
    elevation,
    variant,
    checked,
    setCheckedValue,
  } = props;
  const { lastName, firstName, roomNumber, email, primaryPhone } = resident;
  const { subtitle, secondaryIcon, checkedItem } = useItemStyles();

  const paperProps = {
    variant,
    elevation,
  };

  const onClick = () => {
    if (setCheckedValue) {
      setCheckedValue({
        vendorId,
        vendorIdKey,
        residentId,
      });
    }
  };

  return (
    <Paper {...paperProps} className={checked && checkedItem}>
      <ListItem key={id} onClick={onClick}>
        <Grid container>
          <Grid item xs={12}>
            <ListItemText
              primaryTypographyProps={{
                color: variant === "outlined" ? "textPrimary" : "primary",
              }}
              primary={
                <>
                  <span
                    style={{ marginRight: "12px" }}
                  >{`${lastName}, ${firstName}`}</span>{" "}
                  <span>{vendorId ? vendorId : ""}</span>
                </>
              }
            />
            {checked && (
              <ListItemSecondaryAction>
                <CheckCircle color="primary" />
              </ListItemSecondaryAction>
            )}
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography className={subtitle} variant="subtitle1">
              <House className={secondaryIcon} />
              {`${roomNumber ? roomNumber : " -- "}`}
            </Typography>
          </Grid>
          <Grid item xs={8} sm={4}>
            <Typography className={subtitle} variant="subtitle1">
              <Mail className={secondaryIcon} />
              {`${email ? email : " -- "}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography className={subtitle} variant="subtitle1">
              <Phone className={secondaryIcon} />
              {`${primaryPhone ? primaryPhone : " -- "}`}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}
