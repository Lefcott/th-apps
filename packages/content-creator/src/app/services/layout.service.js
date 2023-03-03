export default class LayoutService {
  static get $inject() {
    return [
      "urlService",
      "$http",
      "masterService",
      "contentEditorService",
      "canvasService",
    ];
  }

  constructor(
    urlService,
    $http,
    masterService,
    contentEditorService,
    canvasService
  ) {
    this.urlService = urlService;
    this.$http = $http;
    this.masterService = masterService;
    this.contentEditorService = contentEditorService;
    this.canvasService = canvasService;
    this.masterObj = this.masterService.getUrlParams();
    this.slideData = [];
    this.drawerItems = [];
  }

  async fetchLayouts() {
    //if orientation is passed in, use it, else use default
    let orientation =
      this.masterObj.orientation.toLowerCase() ||
      this.canvasService.defaultOrientation;
    let response = await this.$http({
      method: "GET",
      url: encodeURI(
        `${this.urlService.getDocument()}/document?communityId=${
          this.masterObj.communityId
        }&template=true&orientation=${orientation}&sort=[{"property":"name","direction":"asc"}]`
      ),
    });

    let customTemplates = [];
    response.data.documents.map((document) => {
      if (!document.template) {
        return;
      }
      customTemplates.push({
        guid: document.guid,
        name: document.name,
        url: document.pages[0].url,
        image: `communities/${this.masterObj.communityId}/thumbs/${document.guid}-0.png`,
      });
    });

    this.slideData[0] = {
      layouts: customTemplates,
      name: "Shared Templates",
      type: "custom",
    };

    let settings = this.contentEditorService.settings;

    if (settings) {
      let themes = settings.themes;

      if (themes) {
        //have layouts been configured explicitly for this orientation?

        let documentFormat =
          orientation.indexOf("print") > -1 ? "print" : "digital";
        let documentOrientation =
          orientation.indexOf("portrait") > -1 ? "portrait" : "landscape";

        if (themes[documentFormat][orientation]) {
          Array.prototype.push.apply(
            this.slideData,
            themes[documentFormat][orientation]
          );
        } else {
          Array.prototype.push.apply(
            this.slideData,
            themes[documentFormat][documentOrientation]
          );
        }
      } else {
        // TODO February 8, 2019: Better logging should occur, but at least
        // record the fact that no themes have been found.
        console.log("content_builder/layout.service found no themes");
      }
    } else {
      // TODO February 8, 2019: Better logging should occur, but at least
      // record the fact that no settings have been found.
      console.log("content_builder/layout.service found no settings");
    }

    this.drawerItems = this.slideData;
  }
}
