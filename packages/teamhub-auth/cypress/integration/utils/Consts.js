/**
 * Mapping of how we are currently representing Cardinal numbers
 *
 * @format
 */

export const TEST_PHOTO = 'testphoto';
export const Z_TEST_PHOTO = 'ztestphoto';
export const TEST_DOC_NAME = 'testcal';
export const TEST_PPT_NAME = 'test_ppt';
export const TEST_WORD_DOC_NAME = 'test_word_doc';

export const USERS = {
  RICHARD: {
    // This user has access to multiple communities.
    EMAIL: 'Richard.belding@k4connect.com',
    PASSWORD: 'DashboardTest',
    COMMUNITY_NAME: 'DO NOT USE - Automated Dashboard Test',
    WELCOME_MESSAGE: 'Hello',
    NAME: 'richard',
  },
  INVALID: {
    EMAIL: 'abdrn@k4connect.com',
    PASSWORD: 'avtdjlg',
  },
  //This user has access to single community.
  ALICIBILLY: {
    EMAIL: 'aliciabilly42@gmail.com',
    PASSWORD: 'Testing@123',
    COMMUNITY_NAME: 'DO NOT USE - Automated Dashboard Test',
    WELCOME_MESSAGE: 'Hello',
  },
};

export const FORGOT_PASSWORD = {
  EMAIL_MESSAGE:
    'Please enter your email address.You will be sent a link to reset your password. This link will expire in 15 minutes.',
  CONFIRM_EMAIL_MESSAGE:
    'An email with instructions on how to reset your password has been sent to:',
};

export const LOGIN_MESSAGES = {
  REQUIRED_EMAIL: 'email is a required field',
  REQUIRED_PASSWORD: 'password is a required field',
  WRONG_CRENDENDIALS:
    'Your username and/or password were incorrect. Please try again or click "Forgot Password" to reset your password.',
};
