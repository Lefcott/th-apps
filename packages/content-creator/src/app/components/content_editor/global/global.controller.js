export default class GlobalController {
  static get $inject() {
    return ["$scope", "actionMenuService"];
  }
  constructor($scope, actionMenuService) {
    this.$scope = $scope;
    this.actionMenuService = actionMenuService;
  }
  clearMenu(e) {
    // do not close drawer if clicking on element with these classes 
    if (
      /main-drawer-container|action-menu__category-buttons|thumbnail-image|thumbnail-image-tag|tab-buttons|thumbnail-image-tag--info|action-menu__hr-line/.test(
        e.target.className
      )
    ) {
    } else {
      this.actionMenuService.closeDrawer();
      this.actionMenuService.currentType = "";
    }
  }
}
