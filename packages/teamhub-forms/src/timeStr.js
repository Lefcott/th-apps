/**
 * TimeStr class - ability to use a time picker
 */

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = [];
window.fbControls.push(function (controlClass) {
  /**
   * Time class
   */
  class controlTimeStr extends controlClass {
    /**
     * Class configuration - return the icons & label related to this control
     * @returndefinition object
     */
    static get definition() {
      return {
        icon: "🕒",
        i18n: {
          default: "Time",
        },
      };
    }

    /**
     * build a text DOM element, supporting other jquery text form-control's
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      const inputConfig = Object.assign({}, this.config, {
        name: this.getName(),
      });
      inputConfig.placeholder = "Select time";
      this.dom = this.markup("input", null, inputConfig);
      return this.dom;
    }

    getName() {
      let { name } = this.config;
      name = this.config.multiple ? `${name}[]` : name;
      return name;
    }

    /**
     * onRender callback
     */
    onRender() {
      const name = this.getName();
      // eslint-disable-next-line no-undef
      $(`#${name}`).flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
      });
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register("timestr", controlTimeStr);
  return controlTimeStr;
});
