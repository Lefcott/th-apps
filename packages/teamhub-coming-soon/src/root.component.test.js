import React from "react";
import { render } from "@testing-library/react";
import Root from "./App";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByText } = render(<Root />);
    expect(getByText(/You got here early!/i)).toBeInTheDocument();
    expect(
      getByText(/A new K4Community Team Hub is coming mid-December./i)
    ).toBeInTheDocument();
  });
});
