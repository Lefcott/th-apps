'use strict';

import template from './confirmation.modal.html';
import './confirmation.modal.css';
import { sendPendoEvent } from "@teamhub/api";

export class ConfirmationModalComponent {

  static get $inject() {
    return [];
  }

  constructor() {
    this.confirmAction = () => console.log('ok')
    this.message = 'Confirmation Message'
  }

  $onInit() {
    this.message = this.resolve.message
    this.confirmAction = this.resolve.confirmAction
    this.confirmTrackingEvent = this.resolve.confirmTrackingEvent
    this.cancelTrackingEvent = this.resolve.cancelTrackingEvent;
  }
  
  cancel() {
    sendPendoEvent(this.cancelTrackingEvent)
    this.close({});
  }

  confirm() {
    this.confirmAction();
    sendPendoEvent(this.confirmTrackingEvent)
    this.close({});

  }
}

export var ConfirmationModalComponentConfig = {
  template: template,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: ConfirmationModalComponent
};
