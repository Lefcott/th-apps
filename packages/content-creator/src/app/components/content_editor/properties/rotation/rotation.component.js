'use strict';

import template from './rotation.component.html';
import './rotation.component.css';

export class RotationComponent {

	static get $inject() {
		return ['$scope', 'contentEditorService'];
	}

	constructor($scope, contentEditorService) {
		this.$scope = $scope;
		this.contentEditorService = contentEditorService;

		this.$scope.$on('elementSelected', (event, element) => {
      this.loadRotation(element);
    });
	}

	loadRotation(element) {
		if (!element) {
			return;
		}

		var rotationHandle = $( "#rotation-custom-handle" );
		let opacityText = $('#calendar-opacity-text-rotation');
		$( "#rotation-slider" ).slider({
			min: 0,
			max: 360,
			step: 15,
			value: this.getRotationDegrees(element),
			create: () => {
				opacityText.text( $( "#rotation-slider" ).slider( "value" ));
			},
			change: () => {
				opacityText.text( $( "#rotation-slider" ).slider( "value" ));
			},
			slide: (event, ui) => {
				opacityText.text(ui.value);
				let rotation = `rotate(${ui.value}deg)`;

				let rotateElem = $(element);
				rotateElem.css({
					'-webkit-transform': rotation,
					'-moz-transform': rotation,
					'-ms-transform': rotation,
					'-o-transform': rotation,
					'transform': rotation,
					'zoom': 1
				});
			},
			stop: () => {
				this.contentEditorService.saveState();
			}
		});
	}

	getRotationDegrees(obj) {

	let rotateElem = $(obj);
    obj = rotateElem;
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform") ||
    obj.css("-ms-transform") ||
    obj.css("-o-transform") ||
		obj.css("transform");
    if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
  }

}

export var RotationComponentConfig = {
	template: template,
	controller: RotationComponent
}