/** @format */

"use strict";

import template from "./image.component.html";
import "./image.component.css";

export class ImageComponent {
	static get $inject() {
		return [
			"$uibModal",
			"extBridgeService",
			"$element",
			"contentEditorService",
			"singleSpaService",
		];
	}

	constructor(
		$uibModal,
		extBridgeService,
		$element,
		contentEditorService,
		singleSpaService,
	) {
		this.$uibModal = $uibModal;
		this.extBridgeService = extBridgeService;
		this.element = $element;
		this.contentEditorService = contentEditorService;
		this.singleSpaService = singleSpaService;
	}

	uploadModal() {
		if (this.contentEditorService.lockContent) {
			return;
		}

		const self = this;

		this.singleSpaService.mount(this.singleSpaService.Parcel.PhotoModal, {
			onSubmit(photos) {
				const [photo] = photos;
				self.modalInstance = self.$uibModal.open({
					appendTo: $("#content-creator"),
					size: "md",
					animation: true,
					component: "imageUpload",
					resolve: {
						record: () => ({
							data: photo,
						}),
						bgImage: false,
					},
				});

				self.modalInstance.result.then(
					(result) => {
						if (result == "close") {
							return;
						}
					},
					(dismiss) => {},
				);
			},
		});
	}

	$onInit() {
    //we may be laoding an image component that already exists, so prefill the image
    if (this.widgetSrc) {
      let imgDOM = $("<div>");
      imgDOM[0].style["backgroundImage"] = `url("${this.widgetSrc}")`;
      imgDOM[0].style["backgroundSize"] = "cover";
      imgDOM[0].style["height"] = "100%";
      imgDOM[0].style["width"] = "100%";
      this.element.children().html(imgDOM);
    }
  }
}


export var ImageComponentConfig = {
	template: template,
	controller: ImageComponent,
	bindings: {
		widgetSrc: "<",
	},
};
