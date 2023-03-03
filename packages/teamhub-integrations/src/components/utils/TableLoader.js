/** @format */

import { get } from "lodash";
import React from "react";
import ContentLoader from "react-content-loader";

export default function TableLoader(props) {
  return (
    <ContentLoader
      width="100%"
      height="70vh"
      backgroundColor="#eaeced"
      foregroundColor="#ffffff"
      {...props}
    >
      <rect rx="2" ry="2" y={40} width="100%" height="30" />
      {Array.from({ length: 10 }).map((_, index) => {
        function getY(index) {
          return 70 + (index * 50 + 30);
        }
        return (
          <>
            <rect
              style={{ transform: "translateX(calc(100% * .001))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="20%"
              height="19"
            />
            <rect
              style={{ transform: "translateX(calc(100% * .23))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="12%"
              height="19"
            />
            <rect
              style={{ transform: "translateX(calc(100% * .37))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="12%"
              height="19"
            />
            <rect
              style={{ transform: "translateX(calc(100% * .51))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="14%"
              height="19"
            />
            <rect
              style={{ transform: "translateX(calc(100% * .66))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="8%"
              height="19"
            />
            <rect
              style={{ transform: "translateX(calc(100% * .76))" }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="26%"
              height="19"
            />
          </>
        );
      })}
    </ContentLoader>
  );
}
