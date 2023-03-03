import React, { useEffect, Suspense } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import _ from "lodash";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { getOneSearchParam } from "@teamhub/api";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

import generateFormsURL from "../util/index";

import FormBuilder from "../components/FormBuilder";
import Destinations from "../components/Destinations";
import SaveButton from "../components/SaveButton";
import {
  destConfig,
  jwt,
  communityId,
  formId,
  forceFormsUpdate,
} from "../recoil/atoms";
import { destinationsList, form } from "../recoil/selectors";

const validator = require("email-validator");

const Builder = () => {
  const history = useHistory();

  const destinations = useRecoilValue(destinationsList);
  const [destinationConfig, setDestConfig] = useRecoilState(destConfig);
  const [currentJwt, setJwt] = useRecoilState(jwt);
  const [currentCommunityId, setCommunityId] = useRecoilState(communityId);
  const [currentFormId, setFormId] = useRecoilState(formId);
  const currentForm = useRecoilValue(form);
  const forceForms = useSetRecoilState(forceFormsUpdate);

  const [name, setName] = React.useState("");
  const [formBuilder, setFormBuilder] = React.useState(null);
  const [requiredFields, setRequiredFields] = React.useState([]);
  const [destinationId, setDestinationId] = React.useState("");
  const [config, setConfig] = React.useState({});
  const [requiredError, setRequiredError] = React.useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    setFormId(getOneSearchParam("formId", ""));

    return () => clearForm();
  }, [setFormId]);

  useEffect(() => {
    if (!_.isEmpty(currentForm)) {
      setDestinationId(currentForm.destination.id);
      setConfig(currentForm.configuration);
      setName(currentForm.name);
    }
  }, [currentForm]);

  const updateName = ({ target }) => {
    setName(target.value);
  };

  const getConfiguration = () => {
    let values = {};
    let errors = 0;

    _.each(destinationConfig, (configuration) => {
      let value = config[configuration.name];
      if (value && value != "") {
        if (configuration.name == "email" && !validator.validate(value)) {
          errors++;
          enqueueSnackbar("Email is invalid", { variant: "error" });
          setRequiredError(true);
        }
        values[configuration.name] = value;
      } else {
        errors++;
      }
    });

    if (errors == 0) {
      return config;
    }
  };

  const checkRequiredFields = (destination, data) => {
    let errors = 0;
    _.each(destination.requiredFields, (configuration) => {
      let field = _.find(data, ["name", configuration.name]);
      if (!field) {
        errors++;
      }
    });

    return errors === 0;
  };

  const saveForm = async (payload) => {
    if (currentFormId) {
      const httpHeaders = {
        Authorization: `Bearer ${currentJwt}`,
      };
      const result = await axios.put(
        `${generateFormsURL()}/forms/${currentFormId}`,
        { data: payload },
        {
          headers: httpHeaders,
        }
      );
      return result;
    } else {
      const httpHeaders = {
        Authorization: `Bearer ${currentJwt}`,
      };
      const result = await axios.post(
        `${generateFormsURL()}/forms/${currentCommunityId}`,
        { data: payload },
        {
          headers: httpHeaders,
        }
      );
      return result;
    }
  };

  const handleSave = async (event) => {
    if (!name || name == "") {
      enqueueSnackbar("A form name must be entered", { variant: "error" });
      return;
    }

    if (!destinationId || destinationId == "none") {
      enqueueSnackbar("A destination must be selected", { variant: "error" });
      return;
    }

    let configuration = getConfiguration();
    if (!configuration) {
      enqueueSnackbar("A required configuration is not set", {
        variant: "error",
      });
      setRequiredError(true);
      return;
    }

    let destination = _.find(destinations, ["id", Number(destinationId)]);
    let data = formBuilder.actions.getData();
    let valid = checkRequiredFields(destination, data);
    if (!valid) {
      enqueueSnackbar("A required field has been removed", {
        variant: "error",
      });
      return;
    }

    let payload = {
      name,
      configuration,
      data,
      destination,
    };

    try {
      const result = await saveForm(payload);
      enqueueSnackbar("Form Saved");
      const { id } = result.data;
      clearForm();
      history.push({ pathname: "/" });
      forceForms((n) => n + 1);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Failed to save form", { variant: "error" });
    }
  };

  const handleCancel = async () => {
    clearForm();
    history.push({ pathname: "/" });
    forceForms((n) => n + 1);
  };

  const clearForm = async () => {
    setFormId("");
    setName("");
    setDestinationId("");
    setDestConfig([]);
    setRequiredFields([]);
    setConfig({});
    setRequiredError(false);
  };

  return (
    <>
      <Suspense fallback={<h3>Loading...</h3>}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="name"
              label="Form Name"
              value={name}
              onChange={updateName}
            />
          </Grid>
          <Destinations
            setRequiredFields={setRequiredFields}
            setDestinationId={setDestinationId}
            destinationId={destinationId}
            config={config}
            setConfig={setConfig}
            error={requiredError}
          />
          <Grid item xs={12}>
            <FormBuilder
              requiredFields={requiredFields}
              setFormBuilder={setFormBuilder}
              form={currentForm}
              setDestinationId={setDestinationId}
            />
          </Grid>
        </Grid>
        <SaveButton handleSave={handleSave} handleCancel={handleCancel} />
      </Suspense>
    </>
  );
};

export default Builder;
