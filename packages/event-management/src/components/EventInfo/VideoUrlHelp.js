/** @format */

import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  // Slide,
  Typography,
} from '@material-ui/core';
import { OpenInNew, YouTube } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';
import { SchedulingLabel } from '../styleUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons';
import { faVimeo } from '@fortawesome/free-brands-svg-icons';
import strings from '../../constants/strings';

const SupportedLinkItem = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: '1em',
});

const HelpBtn = styled(Button)({
  left: '-0.5em',
  textTransform: 'none',
});

const NewDialogTitle = styled(Typography)({
  marginBottom: '0.3em',
});

const VideoHelpDialog = styled(Dialog)({
  padding: '1em !important',
});

export default function VideoUrlHelp(props) {
  const { isOpen, setHelpOpen, videoSrc, showOnTv } = props;

  return (
    <>
      {showOnTv &&
        (videoSrc.name === 'DVD' ? (
          <div>
            <SupportArticleLink
              videoSrc={videoSrc.name}
              videoSrcId={videoSrc.id}
              id={'EM_virtualEvents-videoSrcHelperText-dvd'}
            />
          </div>
        ) : (
          <>
            <Grid
              item
              xs={12}
              id={`EM_virtualEvents-videoSrcHelperText-${videoSrc.id}`}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <HelpBtn
                variant="text"
                color="primary"
                onClick={() => setHelpOpen(true)}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              >
                {strings.Event.videoUrlHelp.learnAbout}
              </HelpBtn>
            </Grid>
            <VideoHelpDialog
              id="EM_virtualEvents-video-help-dialog"
              onClose={() => setHelpOpen(false)}
              aria-labelledby="simple-dialog-title"
              open={isOpen}
              maxWidth="xs"
            >
              <DialogTitle disableTypography>
                <NewDialogTitle
                  component="h2"
                  variant="h5"
                  id="simple-dialog-title"
                  onClose={() => setHelpOpen(false)}
                >
                  {strings.Event.videoUrlHelp.supportedVideoLinks}
                </NewDialogTitle>
              </DialogTitle>
              <DialogContent>
                <DialogContentText component={'span'}>
                  <Grid style={{ marginBottom: '1em' }}>
                    {strings.Event.videoUrlHelp.followingLinksSupported}
                  </Grid>

                  <SupportedLinkItem>
                    <YouTube
                      fontSize="small"
                      style={{ marginRight: '0.6em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.youTubeVideos} <br />
                  </SupportedLinkItem>
                  <SupportedLinkItem>
                    <YouTube
                      fontSize="small"
                      style={{ marginRight: '0.6em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.youTubePlaylists} <br />
                  </SupportedLinkItem>
                  <SupportedLinkItem>
                    <YouTube
                      fontSize="small"
                      style={{ marginRight: '0.6em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.youTubeLive} <br />
                  </SupportedLinkItem>
                  <SupportedLinkItem>
                    <FontAwesomeIcon
                      size="m"
                      icon={faVimeo}
                      style={{ marginRight: '0.6em', marginLeft: '0.2em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.vimeo} <br />
                  </SupportedLinkItem>

                  <Grid style={{ marginTop: '1em', marginBotom: '1em' }}>
                    {strings.Event.videoUrlHelp.followingIntegrationsSupported}
                  </Grid>

                  <SupportedLinkItem>
                    <FontAwesomeIcon
                      size="m"
                      icon={faPlayCircle}
                      style={{ marginRight: '0.6em', marginLeft: '0.2em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.spiro100} <br />
                  </SupportedLinkItem>
                  <SupportedLinkItem>
                    <FontAwesomeIcon
                      size="m"
                      icon={faPlayCircle}
                      style={{ marginRight: '0.6em', marginLeft: '0.2em' }}
                    />{' '}
                    {strings.Event.videoUrlHelp.eversound} <br />
                  </SupportedLinkItem>
                </DialogContentText>
                <SupportArticleLink
                  videoSrcName={videoSrc.name}
                  videoSrcId={videoSrc.id}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setHelpOpen(false)}
                  color="primary"
                  variant="text"
                  style={{ marginRight: '0.6em' }}
                >
                  {strings.Buttons.done}
                </Button>
              </DialogActions>
            </VideoHelpDialog>
          </>
        ))}
    </>
  );
}

function SupportArticleLink({ videoSrcId }) {
  let supportLink =
    'https://support.k4connect.com/knowledgebase/video-and-dvd-scheduling-faqs/';
  return (
    <>
      <Grid style={{ marginTop: '1em' }}>
        <SchedulingLabel>
          {strings.Event.videoUrlHelp.integrationsRequiredUpgrade}
        </SchedulingLabel>
        <Button
          variant="text"
          id={`EM_virtualEvents-videoSrcHelper-supportArticle-${videoSrcId}`}
          color="primary"
          target="_blank"
          href={supportLink}
          style={{
            left: '-6px',
            textTransform: 'none',
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: '12px',
          }}
        >
          {strings.Event.videoUrlHelp.learnMoreUpgrading}
          <OpenInNew
            fontSize="small"
            style={{ marginLeft: '0.6em', fontSize: '12px' }}
          />
        </Button>

        <SchedulingLabel>
          {' '}
          {strings.Event.videoUrlHelp.needHelp}
        </SchedulingLabel>

        <Button
          variant="text"
          id={`EM_virtualEvents-videoSrcHelper-supportArticle-${videoSrcId}`}
          color="primary"
          target="_blank"
          href={supportLink}
          style={{
            left: '-6px',
            textTransform: 'none',
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: '12px',
          }}
        >
          {strings.Event.videoUrlHelp.directBroadcast}
          <OpenInNew
            fontSize="small"
            style={{ marginLeft: '0.6em', fontSize: '12px' }}
          />
        </Button>
      </Grid>
    </>
  );
}
