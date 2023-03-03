/** @format */

import template from "./dining.component.html";
import { get } from "lodash";
import kebabCase from "lodash/kebabCase";

export class DiningComponent {
	static get $inject() {
		return [
			"$scope",
			"$http",
			"$compile",
			"contentEditorService",
			"urlService",
			"masterService",
			"headerPropertiesService",
		];
	}

	constructor(
		$scope,
		$http,
		$compile,
		contentEditorService,
		urlService,
		masterService,
		headerPropertiesService,
	) {
		this.$scope = $scope;
		this.$http = $http;
		this.$compile = $compile;
		this.contentEditorService = contentEditorService;
		this.urlService = urlService;
		this.headerPropertiesService = headerPropertiesService;

		const params = masterService.getUrlParams();
		this.communityId = params.communityId;
		this.orientation = params.orientation;

		this.$scope.refs = {
			restaurants: [],
			menus: [],
			items: [],
		};

		this.$scope.$on("elementSelected", async (event, element) => {
			if (
				$(element).find("menu-daily-widget").length ||
				$(element).find("menu-weekly-widget").length
			) {
				await this.loadWidget(element);
				this.$scope.$applyAsync();
			}
		});

		this.$scope.$on("elementUnselected", async () => {
			this.$scope.element = null;
			this.$scope.widget = null;

			this.$scope.data = { ...this.getInitialData() };

			this.$scope.$applyAsync();
		});

		this.$scope.data = this.getInitialData();

		this.$scope.$watchCollection("data", (val) => {
			this.saveConfig(val, this.$scope.element);
		});

		this.$scope.$watch("data.restaurant", async (id) => {
			await this.getMenus(id);
			this.$scope.$applyAsync();
		});

		this.$scope.$watch("data.menu", async (id) => {
			await this.getMenuItems(id, this.$scope.data.menuMeals);
			this.$scope.$applyAsync();
		});
	}

	getInitialData() {
		return {
			restaurant: null,
			menu: null,
			menuWeek: 0,
			menuDay: null,
			menuStartDate: null,
			menuMeals: [],
			menuItem: null,
			opacity: 100,
			includeDescriptions: false,
			showLogo: true,
			showRestaurant: true,
			showMenu: true,
			includeCategories: false,
			includeImages: false,
		};
	}

	async loadWidget(element) {
		const el = $(element);
		const widget = el.children()[0];
		this.$scope.element = element;
		this.$scope.widget = widget;
		try {
			const config = JSON.parse(el.attr("widget-config"));
			this.$scope.data = { ...config };
			this.headerPropertiesService.setSlideProperty(
				"showLogo",
				config.showLogo,
			);
			this.headerPropertiesService.setSlideProperty(
				"showRestaurant",
				config.showRestaurant,
			);
			this.headerPropertiesService.setSlideProperty(
				"showMenu",
				config.showMenu,
			);
		} catch (err) {}
		await this.getRestaurants();
		this.$scope.$applyAsync();
	}

	async getRestaurants() {
		const queryParams = {
			communityId: this.communityId,
			sort: "name:asc",
		};

		const response = await this.$http({
			method: "GET",
			url: encodeURI(`${this.urlService.getDining()}/locations`),
			params: queryParams,
		});

		const restaurants = response.data.nodes.map(({ data }) => data);

		this.$scope.refs.restaurants = restaurants;
		if (!this.$scope.data.restaurant) {
			this.onRestaurantChange(get(restaurants, "0.id"));
		} else {
			this.$scope.$applyAsync();
		}
	}

	async getMenus(restaurant) {
		if (!restaurant) return [];

		const queryParams = {
			communityId: this.communityId,
			sort: "name:asc",
		};

		const response = await this.$http({
			method: "GET",
			url: encodeURI(
				`${this.urlService.getDining()}/locations/${restaurant}/menus/`,
			),
			params: queryParams,
		});

		const menus = response.data.nodes.map(({ data }) => data);

		this.$scope.refs.menus = menus;

		const currentMenu = this.$scope.data.menu;
		if (!currentMenu || !menus.find((x) => x.id === currentMenu)) {
			this.onMenuChange(get(menus, "0.id", null));
		}
	}

	async getMenuItems(menu, meals) {
		if (!menu || !meals.length) return;

		const queryParams = {
			menuGroupId: meals[0],
		};

		const response = await this.$http({
			method: "GET",
			url: encodeURI(`${this.urlService.getDining()}/menus/${menu}/items/`),
			params: queryParams,
		});

		const items = response.data;
		this.$scope.refs.items = items;

		const currentItem = this.$scope.data.menuItem;
		if (!currentItem || !items.find((x) => x.id === currentItem)) {
			this.onMenuItemChange(get(items, "0.id", null));
		}
	}

	saveConfig(val, element) {
		const el = $(element);
		const widget = $(el.children()[0]);
		if (element) el.attr("widget-config", JSON.stringify(val));
		if (widget) {
			const attrs = Object.entries(val).reduce((params, [key, val]) => {
				params[kebabCase(key)] = val;
				return params;
			}, {});
			widget.attr(attrs);
			this.$compile(widget)(this.$scope);
		}
	}

	getRestaurantById(id) {
		return this.$scope.refs.restaurants.find((x) => x.id === id);
	}

	getMenuById(id) {
		return this.$scope.refs.menus.find((x) => x.id === id);
	}

	getMealsById(ids) {
		if (this.$scope.data.menu && this.$scope.refs.menus.length) {
			const menu = this.getMenuById(this.$scope.data.menu);
			if (!menu) return [];
			return menu.menuGroups.filter((x) => ids.includes(x.id));
		}
	}

	getMenuItemsForDay(day) {
		return this.$scope.refs.items.filter((x) => x.dayActive === day);
	}

	getMenuItemById(id) {
		return this.$scope.refs.items.find((x) => x.id === id);
	}

	onRestaurantChange(id) {
		this.$scope.data.restaurant = id;
		this.$scope.$applyAsync();
	}

	onMenuChange(id) {
		this.$scope.data.menu = id;
		const menu = this.getMenuById(id);
		if (menu) {
			this.$scope.data.menuMeals = menu.menuGroups.map((x) => x.id);
			// this.$scope.data.baseMenuMeals = menu.menuGroups.map((x) => x.id);
			this.$scope.data.menuStartDate = menu.startDate;
		}

		this.$scope.$applyAsync();
	}

	onMenuWeekChange(week) {
		this.$scope.data.menuWeek = week;
		this.$scope.$applyAsync();
	}

	onMenuDayChange(day) {
		this.$scope.data.menuDay = day;
		this.$scope.$applyAsync();
	}

	onMenuMealsChange(ids) {
		this.$scope.data.menuMeals = ids;
		this.$scope.$applyAsync();
	}

	onMenuItemChange(id) {
		this.$scope.data.menuItem = id;
		this.$scope.$applyAsync();
	}

	onOpacityChange(value) {
		this.$scope.data.opacity = value;
		this.$scope.$applyAsync();
	}

	onMenuPropertyChange(property, value) {
		this.$scope.data[property] = value;
		this.$scope.$applyAsync();
	}
}

export var DiningComponentConfig = {
	template,
	controller: DiningComponent,
};
