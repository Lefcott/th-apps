import React from "react";
import {
  act,
  screen,
  render,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import wait from "waait";
import userEvent from "@testing-library/user-event";
import createProvider from "@test-utils/createProvider";
import { GET_CONTENTS, CONTENT_CREATED, CREATE_UPLOAD } from "@graphql/content";
import PhotoModal from "../../src/photo-modal/components/PhotoModal";
import { getOneSearchParam, useCurrentUser, getCommunityId } from "@teamhub/api";

const CURRENT_USER_ID = "current-user-id-1";
const COMMUNITY_ID = "14";
const DOCUMENT_DOCTYPE = "photo";
const DOCUMENT_ORIENTATION = "digital-landscape";

useCurrentUser.mockReturnValue([
  {
    _id: CURRENT_USER_ID,
  },
]);

getCommunityId.mockReturnValue(COMMUNITY_ID)

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

const communityPhoto = {
  _id: "dd807be4-74c7-46d7-92f2-e1fa2537e43f",
  created: "2020-10-22T17:09:40.000+00:00",
  name: "community test photo 1",
  docType: "photo",
  url:
    "https://api-staging.k4connect.com/v2/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/communities%2F14%2Fimages%2F8f28f94d-266b-4a14-9163-726c02987937_dog%2520bpuppy%2520on%2520garden.jpg",
  __typename: "Photo",
};

const communityPhotoForSearching = {
  _id: "28b5b201-b9d2-41ef-a794-d645c08d669f",
  created: "2020-10-20T16:34:04.000+00:00",
  name: "dog bpuppy on garden",
  docType: "community photo for searching",
  url:
    "https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-content-staging.s3.amazonaws.com/images/28b5b201-b9d2-41ef-a794-d645c08d669f.jpg&redirect=true",
  __typename: "Photo",
};

const myPhoto = {
  _id: "a009c46a-82ae-4285-9dd7-1ea5660bfbea",
  created: "2020-10-22T17:01:24.000+00:00",
  name: "1511194376-cavachon-puppy-christmas",
  docType: "my photo",
  url:
    "https://api-staging.k4connect.com/v2/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/communities%2F14%2Fimages%2Fe885d0c7-e7a2-4930-a738-a57a2b88fd32_1511194376-cavachon-puppy-christmas.jpg",
  __typename: "Photo",
};

const myPhotoForSearching = {
  _id: "4f528d23-2f0a-46c8-9d06-37488fb792aa",
  created: "2020-10-22T16:52:11.000+00:00",
  name: "sample",
  docType: "photo",
  url:
    "https://api-staging.k4connect.com/v2/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/communities%2F14%2Fimages%2F348fd312-b33e-4083-80ad-fc624be9a098_sample.jpeg",
  __typename: "Photo",
};

const communityPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: undefined,
        onlyMine: undefined,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [
          communityPhoto,
          communityPhotoForSearching,
          myPhoto,
          myPhotoForSearching,
        ],
        __typename: "Community",
      },
    },
  },
};

const communitySearchedPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: "community",
        onlyMine: undefined,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [communityPhotoForSearching],
        __typename: "Community",
      },
    },
  },
};

const communitySearchedSmallPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: "small",
        onlyMine: undefined,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [communityPhotoForSearching],
        __typename: "Community",
      },
    },
  },
};

const communityNoMatchedPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: "no-matched",
        onlyMine: undefined,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
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

const myPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: undefined,
        onlyMine: true,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [myPhoto, myPhotoForSearching],
        __typename: "Community",
      },
    },
  },
};

const mySearchedPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: "my",
        onlyMine: true,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
      },
    },
  },

  result: {
    data: {
      community: {
        contents: [myPhotoForSearching],
        __typename: "Community",
      },
    },
  },
};

const myNoMatchedPhotosRequest = {
  request: {
    query: GET_CONTENTS,
    variables: {
      communityId: COMMUNITY_ID,
      filters: {
        search: "no-matched",
        onlyMine: true,
        docType: DOCUMENT_DOCTYPE,
      },
      page: {
        limit: 300,
        field: "Edited",
        order: "Desc",
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

const photoUploadedSubscription = {
  request: {
    query: CONTENT_CREATED,
    variables: {
      docType: [DOCUMENT_DOCTYPE],
      communityId: COMMUNITY_ID,
      owner: CURRENT_USER_ID,
    },
  },
  result: {
    data: null,
  },
};

const createUploadSmallFileMutation = {
  request: {
    query: CREATE_UPLOAD,
    variables: {
      communityId: COMMUNITY_ID,
      files: [{ type: "image/jpeg", name: "small-image.jpg" }],
    },
  },
  result: {
    data: {
      community: {
        getUploadUrl: [
          {
            _id: "cca9f889-5c20-4661-aa96-9c3ee5b77396",
            name: "small-image.jpg",
            url: "https://some-upload-url.com",
            __typename: "GetUploadUrlPayload",
          },
        ],
        __typename: "Community_",
      },
    },
  },
};

const createUploadLargeFileMutation = {
  request: {
    query: CREATE_UPLOAD,
    variables: {
      communityId: COMMUNITY_ID,
      files: [{ type: "image/jpeg", name: "large-image.jpg" }],
    },
  },
  result: {
    data: {
      community: {
        getUploadUrl: [
          {
            _id: "cca9f889-5c20-4661-aa96-9c3ee5b77396",
            name: "large-image.jpg",
            url: "https://some-upload-url.com",
            __typename: "GetUploadUrlPayload",
          },
        ],
        __typename: "Community_",
      },
    },
  },
};

describe("PhotoModal", () => {
  let mockUnmountSelf;
  let mockOnSubmit;

  beforeEach(async () => {
    mockUnmountSelf = jest.fn();
    mockOnSubmit = jest.fn();

    const mockQueries = [
      communityPhotosRequest,
      communitySearchedPhotosRequest,
      communitySearchedSmallPhotosRequest,
      communityNoMatchedPhotosRequest,
      myPhotosRequest,
      mySearchedPhotosRequest,
      myNoMatchedPhotosRequest,
      photoUploadedSubscription,
      photoUploadedSubscription,
      createUploadSmallFileMutation,
      createUploadLargeFileMutation,
    ];

    let minProps = {
      parcelData: {
        onSubmit: mockOnSubmit,
      },
      unmountSelf: mockUnmountSelf,
    };

    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });

    await act(async () => {
      render(<PhotoModal {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });
  });

  it("should disable submit button by default", () => {
    expect(
      screen.getByLabelText(/add-photo/i).closest("button")
    ).toBeDisabled();
  });

  it("should be able to close photo modal", () => {
    userEvent.click(screen.getByText(/cancel/i));
    expect(mockUnmountSelf).toHaveBeenCalled();
  });

  it("should be able to select and deselect photo", async () => {
    const [photoOne, photoTwo] = screen.getAllByRole("listitem");

    const { queryByLabelText: photoOneQueryByLabelText } = within(photoOne);
    const { queryByLabelText: photoTwoQueryByLabelText } = within(photoTwo);

    // select first photo
    await act(async () => {
      userEvent.click(photoOneQueryByLabelText("item-action-area"));
    });
    expect(photoOneQueryByLabelText("item-selected")).toBeInTheDocument();
    expect(screen.getByLabelText("add-photo")).not.toBeDisabled();

    // deselect first photo
    await act(async () => {
      userEvent.click(photoOneQueryByLabelText("item-action-area"));
    });
    expect(photoOneQueryByLabelText("item-selected")).not.toBeInTheDocument();
    expect(screen.getByLabelText("add-photo")).toBeDisabled();

    // reselect first photo and select second photo
    await act(async () => {
      userEvent.click(photoOneQueryByLabelText("item-action-area"));
      userEvent.click(photoTwoQueryByLabelText("item-action-area"));
    });
    expect(photoOneQueryByLabelText("item-selected")).not.toBeInTheDocument();
    expect(photoTwoQueryByLabelText("item-selected")).toBeInTheDocument();
    expect(screen.getByLabelText("add-photo")).not.toBeDisabled();

    userEvent.click(screen.getByLabelText("add-photo"));
    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockUnmountSelf).toHaveBeenCalled();
  });

  it("should able to search in community content view", async () => {
    await act(async () => {
      userEvent.type(
        await screen.findByPlaceholderText(/search photo/i),
        "community"
      );
    });

    await screen.findByLabelText(/loading-photos/);
    const photos = await screen.findAllByRole("listitem");

    expect(photos.length).toEqual(1);
    expect(
      screen.getByText(communityPhotoForSearching.name)
    ).toBeInTheDocument();
  });

  it("should display message on empty search in community content view", async () => {
    await act(async () => {
      userEvent.type(
        await screen.findByPlaceholderText(/search photo/i),
        "no-matched"
      );
    });

    await screen.findByLabelText(/loading-photos/);
    expect(await screen.findByText(/no photos/i)).toBeInTheDocument();
  });

  it("should able to search in my content view", async () => {
    await act(async () => {
      userEvent.click(screen.getByText(/community content/i));
      userEvent.click(await screen.findByText(/my content/i));
    });

    await act(async () => {
      userEvent.type(
        await screen.findByPlaceholderText(/search photo/i),
        "my"
      );
    });

    await screen.findByLabelText(/loading-photos/);
    const photos = await screen.findAllByRole("listitem");

    expect(photos.length).toEqual(1);
    expect(screen.getByText(myPhotoForSearching.name)).toBeInTheDocument();
  });

  it("should display message on empty search in my content view", async () => {
    await act(async () => {
      userEvent.click(screen.getByText(/community content/i));
      userEvent.click(await screen.findByText(/my content/i));
    });

    await act(async () => {
      userEvent.type(
        await screen.findByPlaceholderText(/search photo/i),
        "no-matched"
      );
    });

    await screen.findByLabelText(/loading-photos/);
    expect(await screen.findByText(/no photos/i)).toBeInTheDocument();
  });

  describe("Upload", () => {
    beforeEach(() => {
      fetchMock.mockResponse((req) => {
        return Promise.resolve({});
      });
    });

    it("should only be able to upload png or jpg file", async () => {
      const input = screen.getByLabelText(/upload photo/i).closest("input");
      const validFile = new File(["small-binary"], "small-image.jpg", {
        type: "image/jpeg",
      });
      const invalidFile = new File(["small-binary"], "small-image.pdf", {
        type: "application/pdf",
      });
      await act(async () => {
        userEvent.upload(input, [invalidFile]);
      });

      expect(screen.getByText(/pg or png/i)).toBeInTheDocument();

      await act(async () => {
        userEvent.upload(input, [validFile]);
      });

      expect(screen.queryByText(/pg or png/i)).not.toBeInTheDocument();
    });

    it("should not be able to upload files larger than 10MB", async () => {
      const input = screen.getByLabelText(/upload photo/i).closest("input");
      const smallFile = new File(["small-binary"], "small-image.jpg", {
        type: "image/jpeg",
      });
      const largeFile = new File(["large-binary"], "large-image.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(largeFile, "size", { value: 1024 * 1014 * 11 });

      await act(async () => {
        userEvent.upload(input, [largeFile]);
      });

      expect(screen.getByText(/10MB/i)).toBeInTheDocument();

      await act(async () => {
        userEvent.upload(input, [smallFile]);
      });

      expect(screen.queryByText(/10MB/i)).not.toBeInTheDocument();
    });

    it("should show placeholder on upload if the search query is empty", async () => {
      const input = screen.getByLabelText(/upload photo/i).closest("input");
      const matchingFile = new File(["small-binary"], "small-image.jpg", {
        type: "image/jpeg",
      });

      userEvent.upload(input, [matchingFile]);

      expect(
        await screen.findByLabelText("item-placeholder")
      ).toBeInTheDocument();
    });

    it("should show placeholder on upload if matching the search query", async () => {
      const input = screen.getByLabelText(/upload photo/i).closest("input");
      const matchingFile = new File(["small-binary"], "small-image.jpg", {
        type: "image/jpeg",
      });

      await act(async () => {
        userEvent.type(
          await screen.findByPlaceholderText(/search photo/i),
          "small"
        );
      });

      userEvent.upload(input, [matchingFile]);

      expect(
        await screen.findByLabelText("item-placeholder")
      ).toBeInTheDocument();
    });

    xit("should not show placeholder on upload if not matching the search query", async () => {
      const input = screen.getByLabelText(/upload photo/i).closest("input");
      const matchingFile = new File(["small-binary"], "small-image.jpg", {
        type: "image/jpeg",
      });

      await act(async () => {
        userEvent.type(
          await screen.findByPlaceholderText(/search photo/i),
          "community"
        );
      });

      await screen.findByLabelText("loading-photos");

      await act(async () => {
        userEvent.upload(input, [matchingFile]);
        photoUploadedSubscription.result.data = { contentCreated: myPhoto };
      });

      expect(
        screen.queryByLabelText("item-placeholder")
      ).not.toBeInTheDocument();
    });
  });
});
