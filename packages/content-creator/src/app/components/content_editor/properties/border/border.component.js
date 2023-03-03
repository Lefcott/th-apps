'use strict';

import template from './border.component.html';
import './border.component.css';

export class BorderComponent {

  static get $inject() {
    return ['$scope', 'contentEditorService'];
  }

  constructor($scope, contentEditorService) {
    this.$scope = $scope;
    this.contentEditorService = contentEditorService;
    this.hasBorder = false;
    this.isSVG = false;
    this.element = null;
    this.borderColor = null;
    this.borderWidth = null;

    this.$scope.$on('elementSelected', (event, element) => {
      this.loadBorder(element);
    });
  }

  loadBorder(element) {
    if (!element) {
      return;
    }

    let colorPicker = $('#border-color-picker');

    if ($(element).hasClass('shape') || $(element).hasClass('image-obj')) {
      this.isSVG = true;
      this.element = $(element).children('svg');
    } else {
      this.isSVG = false;
      this.element = $(element);
    }

    if (this.isSVG) {
      this.borderColor = $(this.element).attr('stroke');
      this.borderWidth = $(this.element).attr('stroke-width');
    } else {
      this.borderColor = $(this.element).css('border-top-color');
      let borderValue = $(this.element).css('border-top-width');
      borderValue = borderValue.substr(0, borderValue.length - 2);
      this.borderWidth = borderValue;
    }

    if (this.borderWidth && this.borderWidth != "0") {
      this.hasBorder = true;
    } else {
      this.hasBorder = false;
    }

    if (this.borderWidth === undefined) {
      this.borderWidth = 5;
    }

    this.$scope.$applyAsync();

    //Handle border width slider
    let widthHandle = $('#width-custom-handle');
    let opacityText = $('#calendar-opacity-text-border');

    $('#width-slider').slider({
      min: 5,
      max: 100,
      value: this.borderWidth,
      create: () => {
        opacityText.text($('#width-slider').slider('value'));
      },
      change: () => {
        opacityText.text($('#width-slider').slider('value'));
      },
      slide: (event, ui) => {
        opacityText.text(ui.value);
        let width = ui.value;
        this.borderWidth = width;
        this.setBorderWidth();
      },
      stop: () => {
        this.contentEditorService.saveState();
      }
    });


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
        if (this.isSVG) {
          $(this.element).attr('stroke', color.toHexString());
          if ($(this.element).children('circle')) {
            $(this.element).children('circle').attr('stroke', color.toHexString());
          }
        } else {
          $(this.element).css('border-color', color.toHexString());
        }
        colorPicker.spectrum('set', color);
        this.borderColor = color;
      },
      hide: () => {
        this.contentEditorService.saveState();
      }
    });

    colorPicker.spectrum('set', this.borderColor);
  }

  toggleBorder() {
    this.hasBorder = !this.hasBorder;
    this.resetBorder();
    this.contentEditorService.saveState();
  }

  resetBorder() {

    if (this.borderColor == undefined) {
      this.borderColor = 'black';
    }

    if (this.borderWidth == undefined || this.borderWidth === "0") {
      this.borderWidth = 5;
    }

    if (this.hasBorder) {
      if (this.isSVG) {
        if ($(this.element).children('circle')) {
          $(this.element).children('circle').attr('r', 100 - (this.borderWidth / 2));
          $(this.element).children('circle').attr('stroke', this.borderColor);
        }
        $(this.element).attr('stroke', this.borderColor);
        $(this.element).attr('stroke-width', this.borderWidth);
      } else {
        $(this.element).css('border', `${this.borderWidth}px solid ${this.borderColor} `);
      }
      $('#border-color').spectrum('set', 'black');
    } else {
      if (this.isSVG) {
        $(this.element).removeAttr('stroke');
        $(this.element).removeAttr('stroke-width');
        if ($(this.element).children('circle')) {
          $(this.element).children('circle').attr('stroke', '');
          $(this.element).children('circle').attr('r', 100);
        }
      } else {
        $(this.element).css('border', '0px solid black');
        this.borderWidth = 5;
      }
    }
  }

  setBorderWidth() {

    if (this.isSVG) {
      if ($(this.element).children('circle')) {
        $(this.element).children('circle').attr('r', 100 - (this.borderWidth / 2));
      }
      $(this.element).attr('stroke-width', this.borderWidth);
    } else {
      $(this.element).css('border', `${this.borderWidth}px solid ${this.borderColor} `);
    }
  }

}

export var BorderComponentConfig = {
  template: template,
  controller: BorderComponent
}
