/* eslint-disable no-undef */
const generateFormsURL = () => {
  let baseUrl = `https://forms-${process.env.K4_ENV}.k4connect.com`;
  if (process.env.K4_ENV === "production") {
    baseUrl = `https://forms.k4connect.com`;
  }
  return baseUrl;
};

export default generateFormsURL;
