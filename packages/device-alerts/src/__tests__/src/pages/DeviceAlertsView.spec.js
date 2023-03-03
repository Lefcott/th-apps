import React from "react";
import {
  screen,
  render,
  act,
  fireEvent,
  within,
  getByText,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import wait from "waait";
import DeviceAlertsView from "../../../pages/DeviceAlertsView";
import createProvider from "../../test-utils/createProvider";
import { GET_DEVICE_ALERTS } from "../../../graphql/alerts";
import { useCurrentCommunitySettings } from "@teamhub/community-config";
import { getCommunityId, navigate } from "@teamhub/api";
import { range } from "lodash";

const COMMUNITY_ID = getCommunityId();

function createAlertRecord(type, index) {
  return {
    address: `Room #${index}`,
    body: `body-${index}`,
    timestamp: Date.now(),
    type,
    value: Math.random(),
  };
}

function createAlertsForFilters(filters) {
  const alerts = [];
  filters.forEach((type) => {
    const typeAlerts = range(0, 2).map((i) => createAlertRecord(type, i));
    alerts.push(...typeAlerts);
  });
  return alerts;
}

const settings = {
  deviceAlerts: {
    ovenAlertEnabled: true,
    ovenAlertDurationThreshold: 2,
    lowTempAlertEnabled: true,
    lowTempAlertThreshold: 65,
    highTempAlertEnabled: true,
    highTempAlertThreshold: 85,
    leakAlertEnabled: true,
    alertNotificationEnabled: true,
    alertNotificationPhoneNumbers: [],
  },
};

function mockSettings(updates = []) {
  const mock = {
    deviceAlerts: {
      ...settings.deviceAlerts,
      ...updates,
    },
  };
  useCurrentCommunitySettings.mockReset();
  useCurrentCommunitySettings.mockReturnValue([
    mock,
    { loading: false, error: false },
  ]);
}

const allAlertsRequest = {
  request: {
    query: GET_DEVICE_ALERTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 50,
        cursor: null,
      },
      filters: {
        search: "",
        alertTypes: ["HighTemp", "LowTemp", "Leak", "OvenOn"],
      },
    },
  },
  result: {
    data: {
      community: {
        deviceAlerts: {
          alerts: createAlertsForFilters([
            "HighTemp",
            "LowTemp",
            "Leak",
            "OvenOn",
          ]),
          pageInfo: {
            hasNextPage: true,
            cursor: "next-page-cursor",
          },
        },
      },
    },
  },
};

const allAlertsWithSearchRequest = {
  request: {
    query: GET_DEVICE_ALERTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 50,
        cursor: null,
      },
      filters: {
        search: "searching",
        alertTypes: ["HighTemp", "LowTemp", "Leak", "OvenOn"],
      },
    },
  },
  result: {
    data: {
      community: {
        deviceAlerts: {
          alerts: createAlertsForFilters([
            "HighTemp",
            "LowTemp",
            "Leak",
            "OvenOn",
          ]),
          pageInfo: {
            hasNextPage: true,
            cursor: "next-page-cursor",
          },
        },
      },
    },
  },
};

const allAlertsNextPageRequest = {
  request: {
    query: GET_DEVICE_ALERTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 50,
        cursor: "next-page-cursor",
      },
      filters: {
        search: "",
        alertTypes: ["HighTemp", "LowTemp", "Leak", "OvenOn"],
      },
    },
  },
  result: {
    data: {
      community: {
        deviceAlerts: {
          alerts: createAlertsForFilters([
            "HighTemp",
            "LowTemp",
            "Leak",
            "OvenOn",
          ]),
          pageInfo: {
            hasNextPage: true,
            cursor: "next-page-cursor",
          },
        },
      },
    },
  },
};

const noOvenAlertsRequest = {
  request: {
    query: GET_DEVICE_ALERTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 50,
        cursor: null,
      },
      filters: {
        search: "",
        alertTypes: ["OvenOn"],
      },
    },
  },
  result: {
    data: {
      community: {
        deviceAlerts: {
          alerts: [],
          pageInfo: {
            hasNextPage: false,
            cursor: null,
          },
        },
      },
    },
  },
};

const excludeLeakAlertsRequest = {
  request: {
    query: GET_DEVICE_ALERTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 50,
        cursor: null,
      },
      filters: {
        search: "",
        alertTypes: ["HighTemp", "LowTemp", "OvenOn"],
      },
    },
  },
  result: {
    data: {
      community: {
        deviceAlerts: {
          alerts: createAlertsForFilters(["HighTemp", "LowTemp", "OvenOn"]),
          pageInfo: {
            hasNextPage: false,
            cursor: null,
          },
        },
      },
    },
  },
};

describe("SettingsView", () => {
  async function initWrapper(queryMocks = []) {
    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: queryMocks,
      },
    });

    await act(async () => {
      render(<DeviceAlertsView />, {
        wrapper: TestContextProvider,
      });
    });

    await wait(50);
  }

  it("should allow user to navigate to settings", async () => {
    mockSettings();
    initWrapper();

    userEvent.click(screen.getByText(/alert settings/i));
    expect(navigate).toHaveBeenCalledWith("/settings");
  });

  it("should show all alerts", async () => {
    mockSettings();
    await initWrapper([allAlertsRequest, allAlertsNextPageRequest]);

    const lowTempFilterButton = screen.getByLabelText("filter-chip-low-temp");
    const highTempFilterButton = screen.getByLabelText("filter-chip-high-temp");
    const leakFilterButton = screen.getByLabelText("filter-chip-leak");
    const ovenFilterButton = screen.getByLabelText("filter-chip-stove-oven");

    expect(lowTempFilterButton.getAttribute("aria-checked")).toBe("true");
    expect(highTempFilterButton.getAttribute("aria-checked")).toBe("true");
    expect(leakFilterButton.getAttribute("aria-checked")).toBe("true");
    expect(ovenFilterButton.getAttribute("aria-checked")).toBe("true");
    await waitFor(() => expect(screen.getAllByText(/room #0/i).length).toBeGreaterThan(0))
  });

  it("should show specific alerts", async () => {
    mockSettings();
    await initWrapper([excludeLeakAlertsRequest]);

    const leakFilterButton = screen.getByLabelText("filter-chip-leak");
    await act(async () => {
      await userEvent.click(leakFilterButton);
    });

    expect(leakFilterButton.getAttribute("aria-checked")).toBe("false");
  });

  it("should allow user to search", async () => {
    mockSettings();
    await initWrapper([allAlertsRequest, allAlertsNextPageRequest]);

    await act(async () => {
      await userEvent.type(screen.getByRole(/searchbar/i), "searching");
    });
    expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1);
  });
});
