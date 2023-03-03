import React from "react";
import { screen, render, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import wait from "waait";
import SettingsView from "../../../pages/SettingsView";
import createProvider from "../../test-utils/createProvider";
import { UPSERT_SETTINGS } from "../../../graphql/settings";
import { useCurrentCommunitySettings } from "@teamhub/community-config";
import { getCommunityId } from "@teamhub/api";

const singleSpaMock = {
  navigateToUrl: jest.fn(),
};

const settings = {
  deviceAlerts: {
    ovenAlertEnabled: false,
    ovenAlertDurationThreshold: 2,
    lowTempAlertEnabled: false,
    lowTempAlertThreshold: 65,
    highTempAlertEnabled: false,
    highTempAlertThreshold: 85,
    leakAlertEnabled: false,
    alertNotificationEnabled: false,
    alertNotificationPhoneNumbers: [],
  },
};

const saveSettingsRequest = {
  request: {
    query: UPSERT_SETTINGS,
    variables: {
      communityId: getCommunityId(),
      settings,
    },
  },
  result: {
    data: {
      community: {
        settings,
      },
    },
  },
};

describe("SettingsView", () => {
  let queryMocks;

  async function initWrapper() {
    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: queryMocks,
      },
    });

    await act(async () => {
      render(<SettingsView singleSpa={singleSpaMock} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });
  }

  beforeEach(async () => {
    useCurrentCommunitySettings.mockReturnValue([
      () => settings,
      { loading: false, error: null },
    ]);
    queryMocks = [saveSettingsRequest];
  });

  it("should hide settings details by default", async () => {
    initWrapper();
    const collapsedButtons = screen.queryAllByDisplayValue(/collapse/i);
    expect(collapsedButtons.length).toBe(0);
  });

  describe("device alerts", () => {
    function expandDeviceAlert() {
      initWrapper();
      const expandButton = screen.getByLabelText("alerts");
      userEvent.click(expandButton);
    }

    beforeEach(() => {
      useCurrentCommunitySettings.mockReturnValue([
        () => {},
        { loading: false, error: null },
      ]);
    });
    it("should show default low temperature alert to be 65 F", async () => {
      expandDeviceAlert();
      userEvent.click(screen.getByLabelText(/low temperature alert/i));
      const lowTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );
      expect(lowTemperatureField).toHaveDisplayValue(65);
    });

    it("should show default high temperature alert to be 85 F", async () => {
      expandDeviceAlert();
      userEvent.click(screen.getByLabelText(/high temperature alert/i));
      const highTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );
      expect(highTemperatureField).toHaveDisplayValue(85);
    });

    it("should not allow low temperature alert less than 32 F", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/low temperature alert/i));
      const lowTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, "20");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, "32");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should not allow high temperature alert higher than 99 F", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/high temperature alert/i));
      const highTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );

      userEvent.clear(highTemperatureField);
      userEvent.type(highTemperatureField, "100");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(highTemperatureField);
      userEvent.type(highTemperatureField, "85");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should not allow low temperature alert higher than 99 F if high temperature alert is not enabled", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/low temperature alert/i));
      const lowTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, "100");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, "32");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should not allow higher temperature alert higher than 32 F if low temperature alert is not enabled", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/high temperature alert/i));
      const highTemperatureField = await screen.findByLabelText(
        /^temperature$/i
      );

      userEvent.clear(highTemperatureField);
      userEvent.type(highTemperatureField, "20");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(highTemperatureField);
      userEvent.type(highTemperatureField, "32");
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should not allow low temperature alert to be equal to or higher than high temperature alert", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/low temperature alert/i));
      userEvent.click(await screen.findByLabelText(/high temperature alert/i));

      const [
        lowTemperatureField,
        highTemperatureField,
      ] = await screen.findAllByLabelText(/^temperature$/i);
      const highTempValue = parseInt(highTemperatureField.value);

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, `${highTempValue}`);
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, `${highTempValue + 1}`);
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      userEvent.clear(lowTemperatureField);
      userEvent.type(lowTemperatureField, `${highTempValue - 1}`);
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should not allow user to submit with empty phone number", async () => {
      expandDeviceAlert();

      userEvent.click(await screen.findByLabelText(/notifications/i));
      userEvent.click(await screen.findByText(/add phone number/i));
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      const deleteButton = await screen.findByLabelText("phone-number-delete");
      userEvent.click(deleteButton);
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should allow user to add notification phone numbers", async () => {
      expandDeviceAlert();
      userEvent.click(await screen.findByLabelText(/notifications/i));
      userEvent.click(await screen.findByText(/add phone number/i));

      const phoneField = await screen.findByLabelText(/^phone number$/i);

      const invalidPhoneNumber = "9999999999";
      await act(async () => {
        userEvent.clear(phoneField);
        fireEvent.change(phoneField, { target: { value: invalidPhoneNumber } });
        await wait(0);
      });
      expect(screen.getByText(/save/i).closest("button")).toBeDisabled();

      const validPhonePhone = "9196992733";
      await act(async () => {
        userEvent.clear(phoneField);
        fireEvent.change(phoneField, { target: { value: validPhonePhone } });
      });
      await wait(0);
      expect(screen.getByText(/save/i).closest("button")).not.toBeDisabled();
    });

    it("should allow the user to submit settings", () => {
      useCurrentCommunitySettings.mockReturnValue([
        () => settings,
        { loading: false, error: null },
      ]);
      queryMocks = [saveSettingsRequest];
      initWrapper();

      userEvent.click(screen.getByText(/save/i).closest("button"));
    });

    it("should navigate back to building alerts on cancel", () => {
      initWrapper();
      userEvent.click(screen.getByText(/cancel/i));
      expect(singleSpaMock.navigateToUrl).toHaveBeenCalledWith(
        "/building-alerts"
      );
    });
  });
});
