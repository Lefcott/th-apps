export default class SVGClient {
	constructor(options) {
		Object.assign(this, options);

		//add object tag
		this.el = this.element.find("object")[0];
		this.containerEl = this.element.find("div")[0];
		if (!this.el) {
			throw new Error(`element not found for id ${this.id}`);
		}

		//setup click handle
		$(this.containerEl).dblclick((ev) => {
			this.click(ev);
		});

		this.el.addEventListener("load", () => this.loaded());
		this.el.addEventListener("resize", () => this.loaded());
	}

	loaded() {
		//get the svg contents in a walkable document
		this.doc = this.el.contentDocument;

		//parse svg for touch areas and context
		this.parseContext();
		this.parseTouch();
	}

	click(event) {
		const { offsetX, offsetY } = event;

		//get the action if there is one
		const action = this.findTouch(event);

		if (typeof this.handler === "function") {
			this.handler(this.ctx, action);
		}
	}

	parseContext() {
		this.ctx = {};

		const root = this.doc.querySelectorAll("svg")[0];
		this.ctx.id = root.getAttribute("data-id");
		this.ctx.type = root.getAttribute("data-type");
	}

	parseTouch() {
		const { offsetWidth, offsetHeight } = this.el;

		const touch = this.doc.querySelectorAll("*[data-touch]");
		this.locations = [];

		//iterate over all elements with data-touch and add to list

		touch.forEach((element) => {
			const rect = element.getAttribute("data-touch").split(",");
			const action = element.getAttribute("data-action");

			if (rect.length === 4) {
				this.locations.push({
					left: Math.floor(offsetWidth * parseFloat(rect[0])),
					top: Math.floor(offsetHeight * parseFloat(rect[1])),
					right: Math.floor(offsetWidth * parseFloat(rect[2])),
					bottom: Math.floor(offsetHeight * parseFloat(rect[3])),
					action,
				});
			}
		});
	}

	findTouch(event) {
		const { offsetX, offsetY } = event;

		for (const location of this.locations) {
			if (
				offsetX <= location.right &&
				offsetX >= location.left &&
				offsetY <= location.bottom &&
				offsetY >= location.top
			) {
				return location.action;
			}
		}
	}
}
