import React, { useEffect, Suspense } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import { FormControl, TextField, InputLabel, Select } from "@material-ui/core";

import { destConfig } from "../recoil/atoms";

import { destinationsList, form } from "../recoil/selectors";

const Destinations = (props) => {
  const destinations = useRecoilValue(destinationsList);
  const [destinationConfig, setDestConfig] = useRecoilState(destConfig);
  const currentForm = useRecoilValue(form);
  const [did, setDid] = React.useState("none");

  useEffect(() => {
    setDid(props.destinationId);
  }, [props.destinationId]);

  useEffect(() => {
    if (!_.isEmpty(currentForm)) {
      setDestConfig(currentForm.destination.configuration);
    }
  }, [currentForm, setDestConfig]);

  const handleChange = (event) => {
    let dest = destinations[event.currentTarget.value - 1];
    if (dest) {
      props.setDestinationId(dest.id);
      setDid(dest.id);
      setDestConfig(dest.configuration);
      props.setRequiredFields(dest.requiredFields);
    } else {
      props.setDestinationId("none");
      setDestConfig([]);
      props.setRequiredFields([]);
    }
  };

  const onUpdate = (i, event) => {
    const { value } = event.target;
    let newConfig = { ...props.config };
    newConfig[destinationConfig[i].name] = value;
    props.setConfig(newConfig);
  };

  const getDestinationConfig = () => {
    if (destinationConfig.length > 0) {
      return destinationConfig.map((config, idx) => {
        return (
          <Grid item xs={6} key={config.name}>
            <TextField
              fullWidth
              variant="outlined"
              id={`configuration-${config.name}`}
              name={`${config.name}`}
              label={config.label}
              value={_.get(props.config, config.name, "")}
              onChange={(e) => onUpdate(idx, e)}
              error={props.error}
            />
          </Grid>
        );
      });
    } else {
      return <></>;
    }
  };

  return (
    <Grid container item xs={12} spacing={3}>
      <Suspense fallback={<h3>Loading...</h3>}>
        <Grid item xs={6}>
          <FormControl required fullWidth variant="outlined">
            <InputLabel id="destination-label">Destination</InputLabel>
            <Select
              native
              labelId="destination-label"
              id="destination"
              label="Destination"
              onChange={handleChange}
              value={did}
            >
              <option key={0} value="none">
                None
              </option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {getDestinationConfig()}
      </Suspense>
    </Grid>
  );
};

export default Destinations;
