/** @format */
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import Box from '@material-ui/core/Box';
import {
  FormActionButton,
  ClearableFormTextField,
} from '../utils/formComponents';
import LinkPreview from './LinkPreview';

function LinkSelector(props) {
  const { data, onChange, helperText, error, post, response, loading } = props;
  const [localText, setLocalText] = React.useState('');
  const [showLinkSelectorInput, setShowLinkSelectorInput] = useState(false);
  const [debouncedText] = useDebounce(localText, 300);
  const [previewData, setPreviewData] = useState(null);

  const fetchPostData = async (url) => {
    try {
      const urlObject = new URL(url);
      const unfurlData = await post('', { url: urlObject.href });
      if (response.ok) {
        if (data.url === '') {
          let assets = data.assets
            .sort((a) => (a.url !== null ? -1 : 1))
            .find((asset) => asset.type === 'Web');
          setPreviewData(assets.details);
        } else {
          setPreviewData(unfurlData);
        }
      } else {
        setPreviewData(null);
      }
    } catch (err) {
      setPreviewData(null);
    }

    onChange({ target: { name: 'url', value: url } });
  };

  useEffect(() => {
    const { assets } = data;

    const resolvedLinkUrlValue = assets
      ? assets
          .sort((a) => (a.url !== null ? -1 : 1))
          .find((asset) => asset.type === 'Web')
      : null;
    const url = resolvedLinkUrlValue ? resolvedLinkUrlValue.url : '';
    onChange('url', url);
    if (url && url.length) {
      setShowLinkSelectorInput(true);
      setLocalText(url);
    }
  }, []);

  useEffect(() => {
    fetchPostData(debouncedText);
  }, [debouncedText]);

  return (
    <>
      {!showLinkSelectorInput ? (
        <Box mb={2} mt={2} ml={-1}>
          <FormActionButton
            label="Add Link"
            onClick={() => setShowLinkSelectorInput(true)}
            id="AP_postmodal-showLinkInput"
            data-testid="AP_postmodal-showLinkInput"
          />
        </Box>
      ) : (
        <>
          <ClearableFormTextField
            id="AP_postmodal-url"
            data-testid="AP_postmodal-url"
            name="url"
            label="Link"
            disabled={false}
            onChange={(e) => setLocalText(e.target.value)}
            boxStyling={{ marginBottom: '0px', width: '100%' }}
            onClose={() => {
              setLocalText('');
              setShowLinkSelectorInput(false);
            }}
            value={localText}
            error={error}
            helperText={helperText}
          />
          <Box mt={1} width="100%">
            <LinkPreview
              url={localText}
              error={error}
              loading={loading}
              previewData={previewData}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default LinkSelector;
