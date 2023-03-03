/** @format */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';
import urlParser from 'js-video-url-parser';
import { ClearableTextField } from '../utils/formComponents';
import useFetch from 'use-http';
import LinkPreview from './LinkPreview/LinkPreview';
import { getUnfurlerUrl } from '../utils/environment';
import strings from '../constants/strings';

const thirdPartyUrls = ['community.spiro100.com', 'lambda.k4connect.com'];

function parseData(data = null) {
  if (!data) {
    return null;
  }

  const dataToDisplay = {
    type: data?.type,
    provider: data?.provider_name || data?.site,
    title: data?.title,
  };

  dataToDisplay.previewImage = data?.thumbnail_url;

  return dataToDisplay;
}

const unfurlerUrl = getUnfurlerUrl();
// validation for url
const isUrl = (url) => url && url.indexOf('http') > -1;

function EventLinkSelector({
  onLinkChange,
  onPreviewChange,
  disabled,
  ...props
}) {
  // field here is url
  const { response, post } = useFetch(unfurlerUrl, {
    cachePolicy: 'no-cache',
    cacheLife: 0,
  });
  const [loading, setLoading] = useState(false);
  const [localUrl, setLocalUrl] = useState(props.url);
  const [videoSrcError, setVideoSrcError] = useState(null);
  const [previewError, setPreviewError] = React.useState(null);
  const [debouncedText] = useDebounce(localUrl, 300);

  const unfurlUrl = async (url) => {
    try {
      // set loading true,
      setLoading(true);
      setPreviewError(null);
      if (isUrl(url)) {
        const data = await post('', { url });
        // response is coming above, from the destructured use-fetch
        if (response.ok) {
          onPreviewChange(parseData(data));
        } else {
          throw new Error(strings.Event.linkError);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setPreviewError(err.message);
    }
  };

  useEffect(() => {
    unfurlUrl(debouncedText);
    // eslint-disable-next-line
  }, [debouncedText]);

  // this is the useEffect which tries to match the selected video source to the
  // type of url passed, no effect on the
  useEffect(() => {
    const { url, videoSource } = props;
    if (videoSource) {
      const parsedUrlObj = urlParser.parse(url || '');

      if (!parsedUrlObj) {
        if (
          url &&
          !thirdPartyUrls.some((thirdPartyUrl) =>
            url.match(new RegExp(thirdPartyUrl, 'gi')),
          )
        ) {
          setVideoSrcError(strings.Event.invalidLink);
        } else {
          setVideoSrcError(null);
        }
      } else {
        setVideoSrcError(null);
      }
    }
    // eslint-disable-next-line
  }, [props.url, props.urlDetails, props.videoSource]);
  return (
    <>
      <ClearableTextField
        disabled={disabled}
        label={strings.Event.inputs.link}
        id="EM_virtualEvents-url"
        data-testid="EM_virtualEvents-url"
        onChange={(e) => {
          setLocalUrl(e.target.value);
          onLinkChange(e);
        }}
        onClose={() => {
          setLocalUrl('');
          onLinkChange({
            target: {
              name: 'url',
              value: '',
            },
          });
        }}
        boxStyling={{ marginBottom: '0px', width: '100%' }}
        value={localUrl || ''}
        variant="outlined"
        name="url"
        error={props.error}
        style={{ whiteSpace: 'pre-line' }}
        helperText={
          props.error !==
            'The provided url does not match the selected video source' &&
          props.error
        }
        InputLabelProps={{ shrink: true }}
      />
      {isUrl(localUrl) &&
        (!props.error ||
          props.error ===
            'The provided url does not match the selected video source') && (
          <LinkPreview
            videoSrc={props.videoSource && props.videoSource.name}
            errorMessage={videoSrcError || previewError}
            loading={loading}
            url={localUrl}
            {...props.urlDetails}
          />
        )}
    </>
  );
}

EventLinkSelector.defaultProps = {
  onChange: () => {},
  onPreviewChange: () => {},
};

EventLinkSelector.propTypes = {
  onLinkChange: PropTypes.func,
  onPreviewChange: PropTypes.func,
};

// const isUrlDiff = (prevProps, nextProps) => {
//   let oldProps = {
//     values: prevProps.values,
//     error: prevProps.error,
//   };

//   let newProps = {
//     values: nextProps.values,
//     error: nextProps.error,
//   };

//   if (!isEqual(oldProps, newProps)) {
//     return false;
//   }
//   return true;
// };

export default EventLinkSelector;
// export default React.memo(EventLinkSelector, isUrlDiff);
