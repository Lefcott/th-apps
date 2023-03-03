/** @format */

export default {
  login: {
    logo: '.teamhub-auth-teamhub-auth4', //img[alt="K4connect-logo"]
    email: '#TA_login-form_username-input',
    password: '#TA_login-form_password-input',
    loginBtn: '#TA_login-form_submit',
    requiredEmailMessage: `#TA_login-form_username-input-helper-text`,
    requiredPasswordMessage: `#TA_login-form_password-input-helper-text`,
    wrongCredentialsMessage: '[data-testid=TA_login-form_error]',
    forgotPasswordBtn: '#TA_login-form_reset-password',
  },
  forgotPassword: {
    forgotEmail: '#TA_forgot-password_email-input',
    sendBtn: '#TA_forgot-password-send-email',
    forgotPasswordMessage: '[data-testid="TA_forgot-password_form"] p',
    changePasswordMessage: '[data-testid="TA_forgot-password_form"] p',
  },
};
