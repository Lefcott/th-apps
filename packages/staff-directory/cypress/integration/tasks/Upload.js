/** @format */

import RRule from 'rrule2';
import { extend } from 'lodash';
import { Verify } from '../assertions';
import { Click, Type } from '../interactions';

let UploadBtn = '';
export default class Upload {
  static aPDF = () => {
    Click.on(UploadBtn);
  };
}
