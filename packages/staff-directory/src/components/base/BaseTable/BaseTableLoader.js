/** @format */

import React from 'react';
import ContentLoader from 'react-content-loader';

export default function TableLoader(props) {
  return (
    <ContentLoader
      data-testid="base-table-loader"
      width="100%"
      height="100%"
      backgroundColor="#eaeced"
      foregroundColor="#ffffff"
      {...props}
    >
      {Array.from({ length: 10 }).map((_, index) => {
        function getY(index) {
          return index * 50 + 30;
        }
        return (
          <React.Fragment key={index}>
            <rect
              style={{ transform: 'translateX(calc(100% * .001))' }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="30%"
              height="19"
            />
            <rect
              style={{ transform: 'translateX(calc(100% * .36))' }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="18%"
              height="19"
            />
            <rect
              style={{ transform: 'translateX(calc(100% * .60))' }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="14%"
              height="19"
            />
            <rect
              style={{ transform: 'translateX(calc(100% * .80))' }}
              rx="2"
              ry="2"
              y={getY(index)}
              width="18%"
              height="19"
            />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
}
