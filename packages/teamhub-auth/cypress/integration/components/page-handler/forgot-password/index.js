/** @format */

import { Click, Type, Verify } from '../../../interactions';
import ForgotPasswordElements from '../../page-elements/forgot-password-page/elements';

/**
 * This abstracts the actions relating to theChooseCommunityPage
 * @namespaceChooseCommunityPage
 */
export default class ForgotPasswordComponent {
  /**
   * Method to enter EmailId for forgot password
   */
  static enterforgotEmail = (emailId) => {
    Type.theText(emailId).into(ForgotPasswordElements.forgotEmail);
  };

  /**
   * Method to click on send Email for forgot password
   */
  static clickOnsendEmailBtn = () => {
    Click.on(ForgotPasswordElements.sendBtn);
  };

  /**
   * Method to validate enter email address message
   */
  static validateEmailMessage = () => {
    let message =
      'Please enter your email address.You will be sent a link to reset your password. This link will expire in 15 minutes.';
    Verify.theElement(ForgotPasswordElements.forgotPasswordMessage).contains(
      message,
    );
  };

  /**
   * Method to validate email Instructions message
   */
  static validateEmailInstructionsMessage = () => {
    let confirmMessage =
      'An email with instructions on how to reset your password has been sent to:';
    Verify.theElement(ForgotPasswordElements.changePasswordMessage).contains(
      confirmMessage,
    );
  };
}
