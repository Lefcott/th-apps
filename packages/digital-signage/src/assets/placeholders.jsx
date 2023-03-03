import React from 'react';
import ContentLoader from 'react-content-loader';

export const FilesPlaceholder = () => (
    <ContentLoader 
        height={200}
        width={500}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <circle cx="34" cy="88" r="10" /> 
        <rect x="64" y="82" rx="5" ry="5" width="405" height="13" /> 
        <circle cx="34" cy="126" r="10" /> 
        <rect x="64" y="118" rx="5" ry="5" width="405" height="13" /> 
        <circle cx="34" cy="162" r="10" /> 
        <rect x="66" y="156" rx="5" ry="5" width="405" height="13" /> 
        <rect x="26" y="24" rx="5" ry="5" width="446" height="22" />
    </ContentLoader>
);

export const ListPlaceholder = () => (
    <ContentLoader 
      height={600}
      width={775}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <circle cx="48" cy="45" r="30" /> 
      <rect x="88" y="28" rx="4" ry="4" width="198" height="13" /> 
      <rect x="89" y="51" rx="4" ry="4" width="102" height="11" /> 
      <rect x="569" y="33" rx="4" ry="4" width="167" height="13" /> 
      <circle cx="48" cy="167" r="30" /> 
      <circle cx="48" cy="291" r="30" /> 
      <circle cx="48" cy="411" r="30" /> 
      <circle cx="48" cy="532" r="30" /> 
      <rect x="569" y="163" rx="4" ry="4" width="167" height="13" /> 
      <rect x="569" y="283" rx="4" ry="4" width="167" height="13" /> 
      <rect x="569" y="403" rx="4" ry="4" width="167" height="13" /> 
      <rect x="569" y="523" rx="4" ry="4" width="167" height="13" /> 
      <rect x="90" y="152" rx="4" ry="4" width="198" height="13" /> 
      <rect x="90" y="275" rx="4" ry="4" width="198" height="13" /> 
      <rect x="90" y="396" rx="4" ry="4" width="198" height="13" /> 
      <rect x="90" y="516" rx="4" ry="4" width="198" height="13" /> 
      <rect x="90" y="172" rx="4" ry="4" width="102" height="11" /> 
      <rect x="90" y="296" rx="4" ry="4" width="102" height="11" /> 
      <rect x="91" y="417" rx="4" ry="4" width="102" height="11" /> 
      <rect x="91" y="537" rx="4" ry="4" width="102" height="11" /> 
      <rect x="24" y="98" rx="0" ry="0" width="713" height="3" /> 
      <rect x="25" y="229" rx="0" ry="0" width="713" height="3" /> 
      <rect x="25" y="351" rx="0" ry="0" width="713" height="3" /> 
      <rect x="27" y="469" rx="0" ry="0" width="713" height="3" />
    </ContentLoader>
);