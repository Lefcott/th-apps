'use strict';

import template from './background-color.component.html';
import './background-color.component.css';

export class BackgroundColor {

  static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

  constructor($scope, contentEditorService) {
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;

    this.$scope.$on('elementSelected', (event, element) => {
      this.loadBackgroundColor(element);
    });
    this.$scope.$on('backgroundSelected', (event, element) => {
      this.loadBackgroundColor(element);
    });
  }

  loadBackgroundColor(element) {
    if (!element) {
      return;
    }

    let colorPicker = $('#background-color-picker');
    let backgroundColor;
    let svg = $(element).children('svg');

    if ($(element).hasClass('present')) {
      if ($(element).attr('data-background-color') == undefined) {
        $(element).attr('data-background-color', '#fff');
      }
      backgroundColor = $(element).attr('data-background-color');
    } else if (svg) {

      if ($(svg).attr('id') == 'svg-line') {
        backgroundColor = $('.selected line').attr('stroke');
      } else {
        backgroundColor = $(svg).attr('fill');
      }

    } else {
      backgroundColor = $(element).css('background-color');
    }

    colorPicker.spectrum({
      appendTo: "#content-creator",
      preferredFormat: "hex",
      showInput: true,
      cancelText: '',
      showPaletteOnly: true,
      togglePaletteOnly: true,
      togglePaletteMoreText: 'more',
      togglePaletteLessText: 'less',
      palette: [
        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
        ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
        ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
        ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
        ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
        ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
        ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
      ],
      change: (color) => {
        if ($(element).hasClass('present')) {
          $(element).removeAttr('data-background-image');
          $(element).attr('data-background-color', color.toHexString());
          Reveal.sync();
        } else if (svg) {
          if ($(svg).attr('id') == 'svg-line') {
            $('.selected line').attr('stroke', color.toHexString());
          } else {
            $(svg).attr('fill', color.toHexString());
          }
        } else {
          colorPicker.spectrum('set', color);
        }
      },
      hide: () => {
        this.contentEditorService.saveState();
      }
    });

    colorPicker.spectrum('set', backgroundColor);
  }
}

export var BackgroundColorConfig = {
  template: template,
  controller: BackgroundColor
}
