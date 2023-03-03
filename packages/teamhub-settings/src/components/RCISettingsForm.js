import React, { useEffect } from "react";
import * as Yup from "yup";
import { useLazyQuery, useMutation } from "@teamhub/apollo-config";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { get, isEqual } from "lodash";
import { parse, formatISO, isDate, isValid } from "date-fns";
import { Grid, Typography } from "@material-ui/core";
import { isEmptyArray, useFormik } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { getCommunityId, sendPendoEvent } from "@teamhub/api";
import { showToast } from "@teamhub/toast";

import { GET_RCI_SETTINGS, UPSERT_RCI_SETTINGS } from "../graphql/settings";
import TaskBar from "./TaskBar";
import RCIReports from "./RCIReports";
import RCIDivider from "./base/RCIDivider";

const createRCISettingsValidationSchema = () =>
  Yup.array().of(
    Yup.object().shape({
      notifications: Yup.array().of(
        Yup.object().shape({
          time: Yup.string().test("invalidTime", "Invalid time", (value) => {
            const parseTest = parse(value, "kk:mm:ssXXXXX", new Date());
            if (isDate(value) || isValid(parseTest)) {
              return true;
            }
            return false;
          }),
          recipients: Yup.array()
            .of(Yup.string().email("Invalid email format"))
            .test(
              "validEmails",
              "At least one email is required",
              (value, context) => {
                const { enabled } = context.parent;
                if (enabled && isEmptyArray(value)) {
                  return false;
                }
                return true;
              }
            ),
          enabled: Yup.bool(),
        })
      ),
    })
  );

const defaultNotification = {
  recipients: [],
  time: "17:00:00Z",
  enabled: false,
};

const defaultValues = [
  {
    window: {
      start: "10:00:00Z",
      end: "17:00:00Z",
    },
    notifications: [
      {
        recipients: [],
        time: "15:00:00Z",
        enabled: true,
      },
      {
        recipients: [],
        time: "17:00:00Z",
        enabled: false,
      },
    ],
  },
];

export default function RCISettingsForm() {
  const communityId = getCommunityId();
  const validationSchema = createRCISettingsValidationSchema();
  const [getRCISettings, { data, loading, error, refetch }] = useLazyQuery(
    GET_RCI_SETTINGS
  );

  useEffect(() => {
    getRCISettings({
      variables: {
        communityId,
      },
      fetchPolicy: "network-only",
    });
  }, [communityId]);

  function initializedSecondReport(notifications) {
    const secondReport = !notifications[1]
      ? defaultNotification
      : notifications[1];

    return {
      notifications: [{ ...notifications[0] }, { ...secondReport }],
    };
  }

  function initializeRCISettingsData(data) {
    const rciSettings = get(
      data,
      "community.checkin.emailSchedules",
      defaultValues
    );

    const updatedData = rciSettings.map((setting) => {
      const { notifications } = setting;
      const updatedData = initializedSecondReport(notifications);
      return { ...setting, ...updatedData };
    });

    return updatedData;
  }

  const validatedRCIData = initializeRCISettingsData(data);

  const communityTimeZone =
    data?.community?.timezone?.name || "America/New_York";

  function formatNotificationValues(notifications) {
    const notificationValues = notifications.map((notif) => {
      const { time } = notif;
      const formattedTime = isDate(time)
        ? formatISO(time, { representation: "time" })
        : time;

      return {
        enabled: notif.enabled,
        recipients: notif.recipients,
        time: formattedTime,
      };
    });
    return notificationValues;
  }

  function getInputEditValues() {
    const emailSchedules = values.map((schedule) => {
      const { notifications, window } = schedule;
      const cleanNotifications = formatNotificationValues(notifications);
      return {
        window: {
          start: window.start,
          end: window.end,
        },
        notifications: cleanNotifications,
      };
    });
    return {
      emailSchedules: emailSchedules,
    };
  }

  const [updateRCISettings, { loading: loadingRCIUpdate }] = useMutation(
    UPSERT_RCI_SETTINGS,
    {
      async onCompleted() {
        showToast("Resident check-in settings updated");
        refetch();
      },
    }
  );

  function handleAnalytics(values) {
    values.map((value, index) => {
      const firstReport = value.notifications[0];
      const secondReport = value.notifications[1];
      const initialFirstReport = initialValues[index].notifications[0];
      const initialSecondReport = initialValues[index].notifications[1];

      if (!isEqual(firstReport, initialFirstReport)) {
        sendPendoEvent("settings_residentchecking_firstreport");
      }

      if (!isEqual(secondReport, initialSecondReport)) {
        sendPendoEvent("settings_residentchecking_secondreport");
      }
    });
  }

  async function onSubmit(values) {
    handleAnalytics(values);

    const cleanInput = getInputEditValues();
    await updateRCISettings({
      variables: {
        communityId,
        input: cleanInput,
      },
    });
  }

  const formik = useFormik({
    initialValues: validatedRCIData,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
    validateOnMount: false,
    dirty,
  });

  const {
    values,
    errors,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    dirty,
    initialValues,
  } = formik;

  function handleCancel() {
    resetForm({
      values: validatedRCIData,
    });
  }

  if (loading && !data) {
    return <Typography>Loading</Typography>;
  }

  function RenderReports() {
    if (!isEmptyArray(values)) {
      const reports = values.map((settings, index) => {
        return (
          <RCIReports
            key={index}
            index={index}
            values={values[index]}
            setFieldValue={setFieldValue}
            setFieldError={setFieldError}
            errors={errors}
            timeZone={communityTimeZone}
          />
        );
      });
      return <>{reports}</>;
    }
    return <></>;
  }

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container spacing={2}>
          <RenderReports />
          <RCIDivider />
          <Grid container item xs={12} spacing={2} direction={"row-reverse"}>
            <TaskBar
              loading={loading}
              saveDisabled={!formik.isValid || !dirty}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </>
  );
}
