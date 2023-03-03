/** @format */

import { Click, Type, Verify } from '../../../interactions';
import LoginPageElements from '../../page-elements/login-page/elements';
import { LOGIN_MESSAGES, FORGOT_PASSWORD } from '../../../utils/Consts';

/**
 * This abstracts the actions relating to the LoginPage
 * @namespace LoginPage
 */
export default class LoginComponent {
  /**
   * Method to login
   */
  static login = (emailId, password) => {
    Type.theText(emailId).into(LoginPageElements.login.email);
    Type.theText(password).into(LoginPageElements.login.password);
    Click.on(LoginPageElements.login.loginBtn);
  };

  /**
   * Method to click on login button
   */
  static clickOnLoginBtn = () => {
    Click.on(LoginPageElements.login.loginBtn);
  };

  /**
   * Method to check login is loaded or not
   */
  static isLoginPageLoaded = () => {
    Verify.theElement(LoginPageElements.login.email).isVisible();
  };
  /**
   * Method to check error messages
   */
  static validateRequiredFeildMessages = () => {
    Verify.theElement(LoginPageElements.login.requiredEmailMessage).contains(
      LOGIN_MESSAGES.REQUIRED_EMAIL,
    );
    Verify.theElement(LoginPageElements.login.requiredPasswordMessage).contains(
      LOGIN_MESSAGES.REQUIRED_PASSWORD,
    );
  };
  /**
   * Method to check error messages
   */
  static validateWrongCredentailsMessage = () => {
    Verify.theElement(LoginPageElements.login.wrongCredentialsMessage).contains(
      LOGIN_MESSAGES.WRONG_CRENDENDIALS,
    );
  };

  /**
   * Method to click on forgot password
   */
  static clickOnForgotPassword = () => {
    Click.on(LoginPageElements.login.forgotPasswordBtn);
  };

  /**
   * Method to check pageLogo
   */
  static validatePageLogo = () => {
    Verify.theElement(LoginPageElements.login.logo).isVisible();
  };

  /**
   * Method to enter EmailId for forgot password
   */
  static enterforgotEmail = (emailId) => {
    Type.theText(emailId).into(LoginPageElements.forgotPassword.forgotEmail);
  };

  /**
   * Method to click on send Email for forgot password
   */
  static clickOnsendEmailBtn = () => {
    Click.on(LoginPageElements.forgotPassword.sendBtn);
  };

  /**
   * Method to validate enter email address message
   */
  static validateEmailMessage = () => {
    Verify.theElement(
      LoginPageElements.forgotPassword.forgotPasswordMessage,
    ).contains(FORGOT_PASSWORD.EMAIL_MESSAGE);
  };

  /**
   * Method to validate email Instructions message
   */
  static validateEmailInstructionsMessage = () => {
    Verify.theElement(
      LoginPageElements.forgotPassword.changePasswordMessage,
    ).contains(FORGOT_PASSWORD.CONFIRM_EMAIL_MESSAGE);
  };
}
