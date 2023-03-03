import React from "react";
import { render, waitFor } from "@testing-library/react";
import IntegrationsPage from "../components/IntegrationsPage";
import { MemoryRouter as Router } from "react-router-dom";
import createProvider from "./testUtils/createProvider";
import { GET_INTEGRATIONS } from "../graphql/integrations";

const getIntegrations = {
  request: {
    query: GET_INTEGRATIONS,
    variables: { communityId: "2476" },
  },
  result: {
    data: {
      community: {
        integrations: [{ name: "fullcount", type: "pos", properties: {} }],
      },
    },
  },
};
describe("Root component", () => {
  const ApolloProvider = createProvider({
    apolloProps: {
      mocks: [getIntegrations],
    },
    routerProps: { initialEntries: ["/"] },
  });
  it("should be in the document", () => {
    const { getByText } = render(
      <ApolloProvider>
        <IntegrationsPage />
      </ApolloProvider>
    );

    // we have to waitFor because the resident integrations is data driven
    // thus won't show unless there's a response from apollo
    waitFor(() => {
      expect(getByText(/Resident Integrations/gi)).toBeInTheDocument();
      expect(getByText(/Community Integrations/gi)).toBeInTheDocument();
    });
  });
});
