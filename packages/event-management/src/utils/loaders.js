import React from 'react';
import ContentLoader from 'react-content-loader';

export const CalendarLoader = () => (
  <div className="Em-calendarLoader" style={{ border: '1px solid #e3e5e5', flex: '1 1 auto', overflow: 'hidden' }}>
    <ContentLoader 
      height={800}
      width={200}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="10" y="310" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="378" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="442" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="241" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="173" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="102" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="31" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="420" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="356" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="287" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="218" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="150" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="79" rx="4" ry="4" width="121" height="15" /> 
      <rect x="10" y="8" rx="4" ry="4" width="121" height="15" />
      <rect x="10" y="513" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="490" rx="4" ry="4" width="121" height="15" />
      <rect x="10" y="583" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="560" rx="4" ry="4" width="121" height="15" />
      <rect x="10" y="653" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="630" rx="4" ry="4" width="121" height="15" />
      <rect x="10" y="723" rx="4" ry="4" width="183" height="15" /> 
      <rect x="10" y="700" rx="4" ry="4" width="121" height="15" />
    </ContentLoader>
  </div>
);
