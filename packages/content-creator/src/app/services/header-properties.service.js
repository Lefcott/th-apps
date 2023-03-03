"use strict";

export default class HeaderPropertiesService {
	static get $inject() {
		return [];
	}

	constructor() {
		this.currentSlideNumber = 1;
		this.optionsBySlide = {
			[this.currentSlideNumber]: {
				showLogo: true,
				showRestaurant: true,
				showMenu: true,
			},
		};
	}

	changeSlide(slideNumber) {
		this.currentSlideNumber = slideNumber;
		if (!this.optionsBySlide[slideNumber]) {
			this.optionsBySlide[slideNumber] = {
				showLogo: true,
				showRestaurant: true,
				showMenu: true,
			};
		}
	}

	setSlideProperty(property, value) {
		this.optionsBySlide[this.currentSlideNumber][property] = value;
	}
}
