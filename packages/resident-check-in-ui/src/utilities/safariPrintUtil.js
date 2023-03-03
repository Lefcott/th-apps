/**
 * Simple check if browser is safari or not
 */
const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const DEFAULT_PRINT_WINDOW_DIMENSIONS = {
  width: 750,
  height: 450
};

/**
 * Creates popup window used for printing in safari to bypass the print issues.
 */
const openCenteredPopupWindow = (
  windowName = "test",
  url = "",
  w = DEFAULT_PRINT_WINDOW_DIMENSIONS.width,
  h = DEFAULT_PRINT_WINDOW_DIMENSIONS.height
) => {
  const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
  const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
  const opened = window.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  );
  return opened
};

/**
 * Used for copying browser styles into the safari print window.
 * Ref:https://github.com/gregnb/react-to-print/blob/master/src/index.tsx#L372
 */
const copyStyles = (targetDocument) => {
  const headEls = document.querySelectorAll("style, link[rel='stylesheet']");
  for (let i = 0, headElsLen = headEls.length; i < headElsLen; i += 1) {
    const node = headEls[i];

    if (node.tagName === "STYLE") {
      const styleEl = targetDocument.createElement(node.tagName);
      const { sheet } = node;
      if (sheet) {
        let styleCSS = "";
        for (let j = 0, cssLen = sheet.cssRules.length; j < cssLen; j += 1) {
          if (typeof sheet.cssRules[j].cssText === "string") {
            styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
          }
        }
        styleEl.appendChild(targetDocument.createTextNode(styleCSS));
        targetDocument.head.appendChild(styleEl);
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "Encountered invalid HTML. This can cause problems in many browsers, and so the <link> was not loaded. The <link> is:",
        node
      );
    }
  }
};

/**
 * Print handler for Safari. Since Safaris new print handler doesn't block JS, it causes issues after the first print.
 * This helps load content into a temporary window that's used for printing.
 * See: https://github.com/gregnb/react-to-print/issues/397
 * 
 * @param {Object} componentRef Reference (React.useRef) to the printable component
 * @param {String} title Used as the file name in Safari
 * @param {String} pageStyle Additional page styles
 */
const safariPrintHandler = (componentRef, title, pageStyle) => {
  const popupWindow = openCenteredPopupWindow("Print");
  const printDoc = popupWindow.document;
  printDoc.write(`
    <!DOCTYPE>
    <title>${title}</title>
    <html>
    <body>
    ${componentRef.current.innerHTML}
    </body>
    </html>
  `);

  const styleEl = printDoc.createElement("style");
  styleEl.appendChild(printDoc.createTextNode(pageStyle));
  printDoc.head.appendChild(styleEl);

  // copy styles from parent window
  copyStyles(printDoc);

  // clean up
  printDoc.close();
  popupWindow.print();
  popupWindow.close();
};

export { safariPrintHandler, isSafari}