/** @format */
// this is for testing all of our lovely auth utility funcs
import {
  login,
  validateToken,
  resetPassword,
  sendPasswordResetEmail,
} from '../../utils/authentication';

describe('reset password test', () => {
  it('should successfully send a jsonified object to the handler', async () => {
    const res = await resetPassword('goodtoken', 'Newpassword1234');

    expect(res).toBe('success');
  });
});
