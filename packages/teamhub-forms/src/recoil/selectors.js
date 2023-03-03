import { selector } from "recoil";
import _ from "lodash";
import axios from "axios";
import { getCommunityId } from "@teamhub/api";
import generateFormsURL from "../util/index";

import { jwt, formId, forceFormsUpdate } from "./atoms";

export const destinationsList = selector({
  key: "destinations",
  get: async ({ get }) => {
    const httpHeaders = {
      Authorization: `Bearer ${get(jwt)}`,
    };
    const result = await axios.get(
      `${generateFormsURL()}/destinations?communityId=${getCommunityId()}`,
      {
        headers: httpHeaders,
      }
    );
    return result.data;
  },
});

export const formsList = selector({
  key: "forms",
  get: async ({ get }) => {
    get(forceFormsUpdate);
    const httpHeaders = {
      Authorization: `Bearer ${get(jwt)}`,
    };
    try {
      const result = await axios.get(
        `${generateFormsURL()}/forms/${getCommunityId()}`,
        {
          headers: httpHeaders,
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const form = selector({
  key: "form",
  get: async ({ get }) => {
    get(forceFormsUpdate);
    const httpHeaders = {
      Authorization: `Bearer ${get(jwt)}`,
    };
    try {
      const result = await axios.get(
        `${generateFormsURL()}/form/${get(formId)}?communityId=${getCommunityId()}`,
        {
          headers: httpHeaders,
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});
