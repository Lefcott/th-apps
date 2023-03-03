import React from "react";
import {
  act,
  screen,
  render,
  within,
} from "@testing-library/react";
import wait from "waait";
import userEvent from "@testing-library/user-event";
import createProvider from "@test-utils/createProvider";
import { GET_CONTENTS } from "@graphql/content";
import InsertionModal from "@src/insertion-modal/components/InsertionModal";
import { getOneSearchParam } from "@teamhub/api";

const COMMUNITY_ID = "14";
const DOCUMENT_ID = "19c40802-4eb5-462b-985a-1b97cd261151";
const DOCUMENT_ORIENTATION = "digital-landscape";
const DOCUMENT_DOCTYPE = "design";

getOneSearchParam.mockImplementation((name) => {
  switch (name) {
    case "orientation":
      return DOCUMENT_ORIENTATION;
    case "documentId":
      return DOCUMENT_ID;
    case "communityId":
      return COMMUNITY_ID;
    default:
      throw new Error("missing params");
  }
});

const designs = [
  {
    _id: "81560487-62c6-4262-b97a-828c2c87ec4a",
    created: "2020-10-22T18:06:16.000+00:00",
    name: "Design 1",
    docType: "design",
    url:
      "https://api-staging.k4connect.com/v2/content/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/81560487-62c6-4262-b97a-828c2c87ec4a.pdf",
    images: [
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/81560487-62c6-4262-b97a-828c2c87ec4a-0.png&redirect=true",
    ],
    dimensions: "1920x1080",
    units: "px",
    __typename: "Design",
  },
  {
    _id: "adac6f27-626e-4b09-8ab9-60417a3d6764",
    created: "2020-10-21T14:01:25.000+00:00",
    name: "Design 2",
    docType: "design",
    url:
      "https://api-staging.k4connect.com/v2/content/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/adac6f27-626e-4b09-8ab9-60417a3d6764.pdf",
    images: [
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/adac6f27-626e-4b09-8ab9-60417a3d6764-0.png&redirect=true",
    ],
    dimensions: "1920x1080",
    units: "px",
    __typename: "Design",
  },
  {
    _id: "74878fcb-37db-4a20-9645-6b0c5126fbff",
    created: "2020-10-21T15:24:34.000+00:00",
    name: "searched design",
    docType: "design",
    url:
      "https://api-staging.k4connect.com/v2/content/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff.pdf",
    images: [
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-0.png&redirect=true",
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-1.png&redirect=true",
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-2.png&redirect=true",
    ],
    dimensions: "1920x1080",
    units: "px",
    __typename: "Design",
  },
  {
    _id: DOCUMENT_ID,
    created: "2020-10-21T15:24:34.000+00:00",
    name: "searched design",
    docType: "design",
    url:
      "https://api-staging.k4connect.com/v2/content/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff.pdf",
    images: [
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-0.png&redirect=true",
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-1.png&redirect=true",
      "https://content-staging-v3.k4connect.com/download?filename=https://staging-k4connect-documents-adapter.s3.amazonaws.com/74878fcb-37db-4a20-9645-6b0c5126fbff-2.png&redirect=true",
    ],
    dimensions: "1920x1080",
    units: "px",
    __typename: "Design",
  },
];

const allDesignsRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: "14",
      page: { limit: 300, field: "Edited", order: "Desc" },
      filters: {
        search: undefined,
        orientation: "digital-landscape",
        docType: "design",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: designs,
        __typename: "Community",
      },
    },
  },
};

const searchedDesignRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
      filters: {
        search: "searching test",
        orientation: DOCUMENT_ORIENTATION,
        docType: DOCUMENT_DOCTYPE,
      },
    },
  },

  result: {
    data: {
      community: {
        contents: designs,
        __typename: "Community",
      },
    },
  },
};

const noDesignsRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
      filters: {
        search: "no designs matched search",
        orientation: DOCUMENT_ORIENTATION,
        docType: DOCUMENT_DOCTYPE,
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [],
        __typename: "Community",
      },
    },
  },
};

describe("InsertionModal", () => {
  let mockUnmountSelf;
  let mockOnSubmit;

  beforeEach(async () => {
    mockUnmountSelf = jest.fn();
    mockOnSubmit = jest.fn();

    const mockQueries = [
      allDesignsRequest,
      searchedDesignRequest,
      noDesignsRequest,
    ];

    let minProps = {
      parcelData: {
        onSubmit: mockOnSubmit,
        documentId: DOCUMENT_ID,
      },
      unmountSelf: mockUnmountSelf,
    };

    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });

    await act(async () => {
      render(<InsertionModal {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });
  });

  it("should disable submit button by default", () => {
    expect(screen.getByText(/add 0 pages/i).closest("button")).toBeDisabled();
  });

  it("should be able to close insertion modal", () => {
    userEvent.click(screen.getByText(/cancel/i));
    expect(mockUnmountSelf).toHaveBeenCalled();
  });

  it("should be able to search for designs", async () => {
    await act(async () => {
      userEvent.type(
        screen.getByPlaceholderText(/search design/i),
        "searching test"
      );
    });

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toEqual(designs.length - 1);
  });

  it("should display empty search message", async () => {
    await act(async () => {
      userEvent.type(
        await screen.findByPlaceholderText(/search design/i),
        "no designs matched search"
      );
    });

    await screen.findByLabelText('loading-designs');

    expect(
      await screen.findByText(/No designs found named/i)
    ).toBeInTheDocument();
  });

  it("should be able to select from multiple pages", async () => {
    const designSelection = within(screen.getByLabelText("design-selection"));
    const [designOne, designTwo] = designSelection.getAllByRole("listitem");

    // select first design
    const { getByLabelText: designOneGetByLabelText } = within(designOne);
    userEvent.click(designOneGetByLabelText("item-action-area"));
    await screen.findByText(/back/i);

    // select first page
    const [designOnePageOne] = screen.getAllByRole("listitem");
    const { queryByLabelText: designOnePageOneQueryByLabelText } = within(
      designOnePageOne
    );
    userEvent.click(designOnePageOneQueryByLabelText("item-action-area"));
    expect(designOnePageOneQueryByLabelText("item-selected")).toBeInTheDocument();
    expect(designSelection.getByText(/1 pages selected/i)).toBeInTheDocument();
    expect(screen.getByText(/add/i)).not.toBeDisabled();

    // deselect first page
    userEvent.click(designOnePageOneQueryByLabelText("item-action-area"));
    expect(designOnePageOneQueryByLabelText("item-selected")).not.toBeInTheDocument();
    expect(designSelection.getByText(/0 pages selected/i)).toBeInTheDocument();
    expect(screen.getByText(/add/i).closest('button')).toBeDisabled();


    // re-select first page
    userEvent.click(designOnePageOneQueryByLabelText("item-action-area"));
 
    // select second design
    userEvent.click(await screen.findByText(/back/i));
    const { getByLabelText: designTwoGetByLabelText } = within(designTwo);
    userEvent.click(designTwoGetByLabelText("item-action-area"));


    // select first page of second design
    const [designTwoPageOne] = screen.getAllByRole("listitem");
    const { getByLabelText: designTwoPageOneGetByLabelText } = within(
      designTwoPageOne
    );
    userEvent.click(designTwoPageOneGetByLabelText("item-action-area"));

    userEvent.click(await screen.findByText(/back/i));
    expect(designSelection.getByText(/2 pages selected/i)).toBeInTheDocument();

    // submit
    userEvent.click(screen.getByText(/add 2 pages/i).closest("button"));
    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockUnmountSelf).toHaveBeenCalled();
  });
});
