'use strict';

import template from './delete.page.html';
import './delete.page.css';

export class DeleteModalComponent {

  static get $inject() {
    return [];
  }

  constructor() {}
  
  handleDelete() {
    this.close({});
  }

  returnToProject() {
    this.dismiss({});
  }
}

export var DeleteModalComponentConfig = {
  template: template,
  bindings: {
    close: '&',
    dismiss: '&'
  },
  controller: DeleteModalComponent
};
