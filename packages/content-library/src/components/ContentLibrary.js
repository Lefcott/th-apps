import React, { useState, useEffect } from 'react';
import { contentSections } from '../utils/componentData';
import { getCommunityId } from '@teamhub/api';
import { isEqual, isEmpty, get } from 'lodash';
import { HorizLoader } from '../utils/loaders';
import SectionHeader from './SectionHeader';
import HorizSection from './HorizSection';
import ContentCard from './ContentCard';
import ViewFilter from './ViewFilter';
import ErrorImg from '../utils/images/Error.svg';
import EmptyData from '../utils/images/EmptyData.svg';
import { useQuery } from '@teamhub/apollo-config';
import { CONTENT_CREATED, GET_ALL_CONTENT_TYPES } from '../graphql/content';

function ContentLibrary(props) {
  const {
    viewFilter,
    setViewFilter,
    shouldRefetch,
    setRefetch,
    ownerId,
  } = props;

  const [sliderRefs, setSliderRefs] = useState([]);

  const onlyMine = isEqual(viewFilter, 'myContent');
  const { data, loading, error, refetch, subscribeToMore } = useQuery(
    GET_ALL_CONTENT_TYPES,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: {
        communityId: getCommunityId(),
        page: {
          limit: 50,
          field: 'Edited',
          order: 'Desc',
        },
        onlyMine,
      },
    }
  );

  const { designs = [], photos = [], documents = [] } = get(
    data,
    'community',
    {}
  );
  useEffect(() => {
    if (shouldRefetch) refetch();
    setRefetch(false);
    // eslint-disable-next-line
  }, [shouldRefetch]);

  const displayState = (data, sectionKey, loading, error) => {
    if (error) {
      return <img src={ErrorImg} alt="error" />;
    } else if (!data || loading) {
      return <HorizLoader />;
    } else if (data && isEmpty(data)) {
      return <img src={EmptyData} alt="noData" />;
    } else {
      return data.map((content) => (
        <ContentCard
          key={content._id}
          data={content}
          refetch={refetch}
          sliderRefs={sliderRefs}
          sectionKey={sectionKey}
        />
      ));
    }
  };

  const updateCacheFromSubscription = (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev;
    const {
      data: { contentCreated },
    } = subscriptionData;
    const { docType } = contentCreated;

    return Object.assign({}, prev, {
      community: {
        __typename: 'Community',
        ...prev.community,
        // make doc type plural to match the aliases in the query
        [`${docType}s`]: [contentCreated, ...prev.community[`${docType}s`]],
      },
    });
  };

  React.useEffect(() => {
    subscribeToMore({
      document: CONTENT_CREATED,
      variables: {
        communityId: getCommunityId(),
        docType: ['photo', 'design', 'document'],
        owner: ownerId,
      },
      updateQuery: updateCacheFromSubscription,
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ViewFilter value={viewFilter} onChange={setViewFilter} />

      {[
        {
          name: 'designs',
          description: 'Content made using the Creator',
          data: designs,
        },
        {
          name: 'documents',
          description: 'Uploaded pdf files',
          data: documents,
        },
        { name: 'photos', description: 'Uploaded photos', data: photos },
      ].map((section) => (
        <div key={section.name} id={`CL_library-${section.name}`}>
          <SectionHeader data={section} expandable={true} path={section.name} />
          <HorizSection
            setSliderRefs={setSliderRefs}
            sliderRefs={sliderRefs}
            sectionKey={section.name}
          >
            {displayState(section.data, section.name, loading, error)}
          </HorizSection>
        </div>
      ))}
    </>
  );
}

export default ContentLibrary;
