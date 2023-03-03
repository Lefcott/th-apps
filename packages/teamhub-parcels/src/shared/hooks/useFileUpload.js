import { useState } from "react";
import { get } from "lodash";
import { getOneSearchParam, useCurrentUser } from "@teamhub/api";
import { useMutation, useSubscription } from "@apollo/client";
import { CREATE_UPLOAD, CONTENT_CREATED } from "@graphql/content";

export default function useFileUpload({
  communityId,
  docType,
  onFileUploadCompleted,
}) {
  communityId = communityId || getOneSearchParam("communityId", "2476");

  const [user] = useCurrentUser();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [failed, setFailed] = useState([]);
  const [inprogress, setInprogress] = useState([]);

  const [createUpload] = useMutation(CREATE_UPLOAD, {});

  useSubscription(CONTENT_CREATED, {
    variables: {
      docType,
      communityId,
      owner: user?._id,
    },
    fetchPolicy: "no-cache",
    onSubscriptionData({ subscriptionData }) {
      const content = get(subscriptionData, "data.contentCreated", null);
      if (!content) {
        return;
      }

      if (onFileUploadCompleted) {
        onFileUploadCompleted(content);
      }

      const newCompleted = [];
      const newInprogress = [];

      inprogress.forEach((job) => {
        const { file, upload } = job;

        if (content._id === upload._id) {
          newCompleted.push({ upload, file, data: content });
        } else {
          newInprogress.push({ upload, file });
        }
      });

      setCompleted((completed) => [...completed, ...newCompleted]);
      setInprogress(() => [...newInprogress]);
    },
  });

  function clean({ newName, name, type }) {
    return {
      type,
      name: name || newName,
    };
  }

  async function handleUpload(files) {
    if (!files.length) {
      return;
    }

    try {
      setLoading(true);
      const uploadUrlResponse = await createUpload({
        variables: {
          files: files.map(clean),
          communityId: communityId,
        },
      });

      const uploadUrls = uploadUrlResponse.data.community.getUploadUrl;

      const promises = uploadUrls.map((upload) => {
        const file = files.find(
          ({ name, newName }) => upload.name === name || upload.name === newName
        );

        try {
          const response = fetch(upload.url, {
            method: "PUT",
            body: file,
            "Content-Type": file.type,
          });
          setInprogress((inprogress) => [...inprogress, { upload, file }]);
          return response;
        } catch (err) {
          setFailed((failed) => [...failed, { upload, file, error }]);
        }
      });

      await Promise.all(promises);
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return [handleUpload, { loading, error, completed, failed, inprogress }];
}
