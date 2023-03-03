import { atom } from "recoil";

export const jwt = atom({
  key: "jwt",
  default: "",
});

export const user = atom({
  key: "user",
  default: null,
});

export const communityId = atom({
  key: "communityId",
});

export const forceFormsUpdate = atom({
  key: "forceForms",
  default: 0,
});

export const destConfig = atom({
  key: "destinationConfig",
  default: [],
});

export const formId = atom({
  key: "formId",
  default: "",
});
