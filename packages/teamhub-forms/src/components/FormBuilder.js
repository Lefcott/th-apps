import React from "react";
import $ from "jquery";
import _ from "lodash";

window.jQuery = $;
window.$ = $;

require("jquery-ui-sortable");
require("formBuilder");

const DEFAULT_TEXT = "__TO_FILL__";

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.setFormBuilder = props.setFormBuilder;
    this.currentForm = props.form;
    this.setDestinationId = props.setDestinationId;
  }

  componentDidMount() {
    //configure the editor
    let replaceFields = [
      {
        type: "text",
        label: "Text Field",
        className: "mui-textfield",
      },
      {
        type: "textarea",
        label: "Text Area",
        className: "mui-textfield",
      },
      {
        type: "date",
        label: "Date Field",
        className: "mui-textfield",
      },
      {
        type: "header",
        label: "Header",
        className: "mui--text-headline",
      },
      {
        type: "number",
        label: "Number",
        className: "mui-textfield",
      },
      {
        type: "paragraph",
        label: "Paragraph",
        className: "mui--text-body1",
      },
      {
        type: "select",
        label: "Select",
        className: "mui-select",
      },
      {
        type: "timestr",
        label: "Time",
        className: "mui-textfield",
      },
    ];
    let config = {
      disabledActionButtons: ["data", "clear", "save"],
      disableFields: ["autocomplete", "button", "file", "hidden"],
      disabledAttrs: [
        "access",
        "className",
        "description",
        "inline",
        "max",
        "min",
        "multiple",
        "other",
        "placeholder",
        "rows",
        "step",
        "style",
        "subtype",
        "toggle",
        "value",
      ],
      layoutTemplates: {
        default: (field, label, help, data) => {
          let className = field.className;
          if (className == "checkbox-group") {
            field.className = `${className} mui-checkbox`;
          } else if (className == "radio-group") {
            field.className = `${className} mui-radio`;
          }
          return $("<div/>").addClass(className).append(field);
        },
      },
      onOpenFieldEdit: (e) => {
        $(".mui-textfield.fld-maxlength.form-control").prop("disabled", true);
      },
      replaceFields: replaceFields,
      typeUserAttrs: {
        select: {
          uri: {
            label: "URI",
            value: DEFAULT_TEXT,
          },
        },
      },
    };

    if (!_.isEmpty(this.currentForm)) {
      config.formData = this.currentForm.data;
    }

    this.$el = $(this.el);
    this.formBuilder = this.$el.formBuilder(config);
    this.setFormBuilder(this.formBuilder);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEmpty(this.props.form) && this.formBuilder.actions.getData) {
      this.addRequiredFields(this.props.form.data);
    }
    this.updateRequiredFields(
      prevProps.requiredFields,
      this.props.requiredFields
    );
  }

  removeRequiredFields(reqFields) {
    const originalFormFields = this.formBuilder.actions.getData() || [];
    this.formBuilder.actions.clearFields(false);
    originalFormFields.map((field) => {
      const duplicate = _.find(reqFields, { name: field.name });
      if (_.isUndefined(duplicate)) {
        this.formBuilder.actions.addField(field);
      }
    });
  }

  addRequiredFields(reqFields) {
    const originalFormFields = this.formBuilder.actions.getData() || [];
    const fields = _.cloneDeep(reqFields);
    fields.map((field, i) => {
      const duplicate = originalFormFields.find((existing) => {
        return _.every(_.keys(field), (prop) => {
          if (!_.has(existing, prop)) {
            return false;
          }
          return _.isEqual(field[prop], existing[prop]);
        });
      });

      if (duplicate) {
        // Don't re-add a required field!
        return;
      }

      field.required = field.required !== undefined ? field.required : true;
      if (field.type === "text") field.className = "mui-textfield";
      if (field.type === "textarea") field.className = "mui-textfield";
      if (field.type === "date") field.className = "mui-textfield";
      if (field.type === "header") field.className = "mui--text-headline";
      if (field.type === "number") field.className = "mui-textfield";
      if (field.type === "paragraph") field.className = "mui--text-body1";
      if (field.type === "select") field.className = "mui-select";
      if (field.type === "timestr") field.className = "mui-textfield";
      if (originalFormFields.length == 0) {
        this.formBuilder.actions.addField(field);
      } else {
        this.formBuilder.actions.addField(field, i);
      }
    });
  }

  updateRequiredFields(prevReqFields, reqFields) {
    if (this.formBuilder.actions.getData) {
      this.removeRequiredFields(prevReqFields);
      this.addRequiredFields(reqFields);
    }
  }

  render() {
    return (
      <div>
        <div ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default FormBuilder;
