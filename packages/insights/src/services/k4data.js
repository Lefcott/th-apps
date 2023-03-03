class K4DataLoader {
	constructor(baseUrl, jwt, debug = false) {
		this.jwt = jwt;
		this.baseUrl = baseUrl;
		this.debug = debug;
		this.widgets = {};

		this.listener = e => {
			if (!this.widgets[e.data.id]) return;
			this.widgets[e.data.id].message(e);
		};

		window.addEventListener("message", this.listener);

		window.onresize = () => {
			for (var i in this.widgets) {
				let widget = this.widgets[i];
				widget.resize();
			}
		};
	}

	async addWidget(id, guid, filters) {
		
    return new Promise((resolve) => {
      this.widgets[id] = new K4DataWidget(
        id,
        guid,
        filters,
        this.baseUrl,
        this.jwt,
        this.debug
      );
  
      this.widgets[id].init();
      this.widgets[id].frame.onload = () => {
				setTimeout(() => {
					console.log('widget loaded')
        	resolve();
				}, 1000)
      }
    })
		
	}

	removeWidget(id) {
		console.log(this.widgets[id])
		if (!this.widgets[id]) return;
		this.widgets[id].kill();
		this.widgets[id] = undefined;
	}

	kill() {
		Object.keys(this.widgets).forEach(id => {
			this.removeWidget(id);
		});
		document.removeEventListener("message", this.listener);
	}
}

class K4DataWidget {
	constructor(id, guid, filters, target, jwt, debug) {
		this.id = id;
		this.container = document.getElementById(id);

		this.guid = guid;
		this.filters =
			typeof filters === "string" ? filters : JSON.stringify(filters);
		this.target = target;
		this.jwt = jwt;
		this.debug = debug;

	}

	init() {
		this.frame = document.createElement("iframe");
		this.frame.style.display = "none";
		this.frame.style.overflow = "hidden";
		this.frame.height = "0px;";
		this.frame.scrolling = "no";

		this.container.appendChild(this.frame);

		this.link = location.href;

		this.origin = location.origin;
		this.width = this.container.offsetWidth;
		this.widget = `${this.target}/standalone?id=${this.id}&guid=${
			this.guid
		}&width=${this.width}&filters=${encodeURIComponent(
			this.filters
		)}&origin=${encodeURIComponent(this.origin)}`;

		this.frame.src = this.widget;

		this.console(this.widget);
	}

	message(e) {
		if (e.data) {
			this.console("message", e.data);
			let data = e.data;
			if (data.width) {
				this.console("set frame width", data.width);
				this.width = data.width;
				this.frame.style.width = data.width + "px";
			}

			if (data.height) {
				this.console("set frame height", data.height);
				this.height = data.height;
				this.frame.style.height = data.height + "px";
			}

			if (data.display) {
				this.console("enable display");
				this.frame.style.border = "none";
				this.frame.style.display = "block";
			}

			if (data.action) {
				if (data.action === "requestJwt") {
					this.frame.contentWindow.postMessage(
						{
							jwt: this.jwt,
						},
						this.target
					);
				}
			}
		}
	}

	kill() {
		this.container.removeChild(this.frame);
	}

	resize() {
		this.width = this.container.offsetWidth;

		this.console("resize", this.width);

		if (this.timeout) {
			clearTimeout(this.timeout);
		}

		this.timeout = setTimeout(() => {
			this.timeout = null;
			this.frame.contentWindow.postMessage(
				{
					width: this.width,
				},
				this.target
			);
		}, 100);
	}

	console() {
		if (this.debug) {
			console.log.apply(null, arguments);
		}
	}
}

export default K4DataLoader;
window.K4DataLoader = K4DataLoader;