import "./set-public-path";
import singleSpaIframes from "@k4connect/single-spa-iframes";

const iframeLifeCycles = singleSpaIframes({
  baseUrl: 'https://support.k4connect.com',
  pathname: ' ',
  elGetter() {
    const root = document.getElementById('appshell__main-content');
    return root;
  }
});

export const { bootstrap, mount, unmount } = iframeLifeCycles;
