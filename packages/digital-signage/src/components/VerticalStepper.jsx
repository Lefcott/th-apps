/** @format */

import React, { useState, useEffect } from 'react';
import { useSchedules } from '../contexts/ScheduleProvider';
import { isEqual, isEmpty } from 'lodash';
import {
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Grid,
} from '@material-ui/core';

function VerticalStepper(props) {
  const { steps, errors, validateForm, handleSubmit } = props;
  const [activeStep, setActiveStep] = useState(1);
  const isLastStep = isEqual(activeStep, steps.length);
  const { activeSchedule } = useSchedules();

  useEffect(() => setActiveStep(1), [activeSchedule]);

  const onActionClick = () => {
    if (isLastStep) {
      // publish is clicked
      handleSubmit();
      if (!isEmpty(errors)) {
        if (errors.destinations) {
          return setActiveStep(1);
        } else if (errors.rule && errors.rule.dtstart) {
          return setActiveStep(2);
        } else if (errors.rule && errors.rule.duration) {
          return setActiveStep(3);
        } else {
          return setActiveStep(4);
        }
      }
    } else {
      // next is clicked
      validateForm();
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Stepper activeStep={activeStep - 1} nonLinear orientation="vertical">
      {steps.map((step) => (
        <Step key={step.id}>
          <StepLabel
            style={{
              cursor: 'pointer',
              weight: 'bold',
              lineHeight: '24px',
              fontSize: '20px',
            }}
            onClick={() => {
              setActiveStep(step.id);
              validateForm();
            }}
          >
            {step.label}
          </StepLabel>
          <StepContent>
            <Grid item>{step.body}</Grid>
            <Grid item>
              <Button
                color="primary"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={onActionClick}
              >
                {isLastStep ? 'Publish' : 'Next'}
              </Button>
            </Grid>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}

export default VerticalStepper;
