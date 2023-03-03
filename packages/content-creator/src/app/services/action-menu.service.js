"use strict";

export default class ActionMenuService {

  static get $inject() {
    return [];
  }

  constructor() {
    this.themeCss = "default";
    this.mainDrawer = false;
    this.currentType = "";
    this.menuItems = [
      {
        // INSERT BUTTON
        id: "CR_insertBtn",
        active: false,
        category: "",
        buttonText: "Insert",
        type: "insertOptions",
        class: "tab-buttons",
        // action: this.getSavedTemplates.bind(this),
        show: true
      },
      {
        // SLIDES BUTTON
        id: "CR_templatesBtn",
        active: false,
        category: "slide",
        buttonText: "Slide Templates",
        type: "layoutOptions",
        class: "tab-buttons",
        show: true
      }
    ];
  }

  closeDrawer() {
    // close main drawer
    this.mainDrawer = false;
    this.closeActiveState();
  }

  closeActiveState() {
    // reset active state for menu
    this.menuItems.forEach((item, key) => {
      item.active = false;
    });
  }

  getMenuItems() {
    return this.menuItems;
  }

}
