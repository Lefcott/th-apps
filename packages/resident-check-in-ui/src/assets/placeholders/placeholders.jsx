import React from 'react';
import ContentLoader from 'react-content-loader';
import { Typography, Grid } from '@material-ui/core';
import styled from '@emotion/styled';
import emptyCard from '../images/emptyCard.png';
import emptyCardx2 from '../images/emptyCardx2.png'
import emptyCardx3 from '../images/emptyCardx3.png'

export const CardNoSelectedResident = props => {
  return <img style={{ width: '100%', height: '100%' }} srcSet={`${emptyCard} 1x, ${emptyCardx2} 2x, ${emptyCardx3} 3x`} src={emptyCard} alt="jammin'"></img>
}


export const ListPlaceholder = props => (
  <ContentLoader
    height={props.height || 600}
    width={props.width || 600}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="13.56" y="42.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="447.93" y="27.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="14.56" y="19.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="7.56" y="74.81" rx="0" ry="0" width="584" height="3" />
    <rect x="46.56" y="32.81" rx="0" ry="0" width="0" height="0" />
    <rect x="12.56" y="98.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="13.56" y="122.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="449.93" y="109.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="7.56" y="154.81" rx="0" ry="0" width="584" height="3" />
    <rect x="7.56" y="233.81" rx="0" ry="0" width="584" height="3" />
    <rect x="16.56" y="178.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="16.56" y="202.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="449.93" y="191.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="7.56" y="314.81" rx="0" ry="0" width="584" height="3" />
    <rect x="17.56" y="258.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="16.56" y="283.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="449.93" y="271.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="7.56" y="392.81" rx="0" ry="0" width="584" height="3" />
    <rect x="6.56" y="473.81" rx="0" ry="0" width="584" height="3" />
    <rect x="6.56" y="553.81" rx="0" ry="0" width="584" height="3" />
    <rect x="449.93" y="351.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="449.93" y="431.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="449.93" y="511.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="16.56" y="337.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="17.56" y="362.81" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="15.56" y="418.01" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="15.56" y="444.01" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="15.56" y="499.01" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="16.56" y="525.01" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="16.56" y="578.01" rx="0" ry="0" width="189.66" height="11.02" />
    <rect x="448.93" y="590.5" rx="0" ry="0" width="134.47" height="12.25" />
    <rect x="16.56" y="603.01" rx="0" ry="0" width="189.66" height="11.02" />
  </ContentLoader>
)

const EmptyListWrapper = styled(Grid)`
  display: block;
  text-align: center;
  padding: 0 15px;
`;

export const FilteredListPlaceholder = ({ search, filters }) => (
  <EmptyListWrapper>
    <Typography>We couldn't find anything matching:</Typography>
    {search && <Typography style={{ fontWeight: 600 }}>
      <span style={{ fontWeight: 400 }}>Search: </span>{search}</Typography>}
    {filters && filters.length > 0 && <Typography style={{ fontWeight: 600 }}><span style={{ fontWeight: 400 }}>Filters: </span>{filters.join(',')}</Typography>}

  </EmptyListWrapper>
);

export const BannerPlaceholder = props => (
  <ContentLoader
    height={60}
    width={1200}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="1" rx="0" ry="0" width="1200" height="3" />
    <rect x="400" y="17" rx="0" ry="0" width="400" height="10" />
    <rect x="0" y="42" rx="0" ry="0" width="1200" height="3" />
  </ContentLoader>
)

export const CardPlaceholder = props => (
  <ContentLoader
    height={650}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <circle cx="42" cy="216" r="8" />
    <rect x="57" y="211" rx="5" ry="5" width="220" height="10" />
    <circle cx="42" cy="246" r="8" />
    <rect x="57" y="241" rx="5" ry="5" width="220" height="10" />
    <circle cx="42" cy="276" r="8" />
    <rect x="57" y="271" rx="5" ry="5" width="220" height="10" />
    <circle cx="42" cy="306" r="8" />
    <rect x="57" y="301" rx="5" ry="5" width="220" height="10" />
    <circle cx="86.76" cy="63.65" r="42.45" />
    <circle cx="79.31" cy="81.2" r="0" />
    <rect x="169.31" y="25.2" rx="0" ry="0" width="155.39" height="12" />
    <rect x="170.31" y="48.2" rx="0" ry="0" width="155.39" height="12" />
    <rect x="169.11" y="75.2" rx="0" ry="0" width="155.39" height="12.96" />
    <rect x="35.9" y="121.2" rx="0" ry="0" width="320" height="24" />
  </ContentLoader>
)

export const NotesPlaceholder = props => (
  <ContentLoader
    height={60}
    width={500}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="1.56" y="3.61" rx="3" ry="3" width="475.61" height="22.34" />
    <rect x="1" y="31" rx="3" ry="3" width="358.79" height="13.44" />
  </ContentLoader>
)
