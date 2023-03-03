'use strict';

class ZoomDirective {

  static get $inject() {
    return [];
  }

  constructor(contentEditorService) {
    this.contentEditorService = contentEditorService;
    this.restrict = 'A';
    this.scope = false;
  }

  link($scope, element, attr, contentEditorService) {
    let zoomScale = 1;
    let scaleFactor = 0.1;
    $scope.zoomElement = element;
    $scope.$on('zoomIn', (ev, args) => {
      zoomScale += scaleFactor;
      this.contentEditorService.zoomScale = zoomScale;
      transformElement(args);
    });

    $scope.$on('zoomOut', (ev, args) => {
      zoomScale -= scaleFactor;
      this.contentEditorService.zoomScale = zoomScale;
      transformElement(args);
    });

    $scope.$on('zoomReset', (ev, args) => {
      reset(args);
      this.contentEditorService.zoomScale = zoomScale;
    });

    function transformElement(zoomElement) {
      const isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function(p) {
          return p.toString() === '[object SafariRemoteNotification]';
        })(
          !window['safari'] ||
            (typeof safari !== 'undefined' && safari.pushNotification)
        );

      if (isSafari == true) {
        // if safari browser
        zoomElement.css({
          '-webkit-transition': 'all 0.1s linear',
          '-webkit-transform': 'scale(' + zoomScale + ')',
          transformOrigin: '0 0'
        });
      } else {
        // all other browsers
        zoomElement.css({
          transition: 'all 0.1s linear',
          transform: 'scale(' + zoomScale + ')',
          transformOrigin: '0 0'
        });
      }
    }

    function reset(zoomElement) {
      zoomScale = 1.0;
      zoomElement.removeAttr('style');
    }
  }
}

export default ZoomDirective;
