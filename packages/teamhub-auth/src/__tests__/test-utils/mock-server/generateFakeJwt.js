/** @format */

import jwt from 'jsonwebtoken';

const SECRET = 'supersecret';
export const mockSession = {
  name: 'session',
  value: '23cff19e-4b6b-4499-aebc-1a7d1b41c861',
};

export default function generateMockJwt() {
  return jwt.sign(
    {
      guid: '61e9811c-9dd4-423d-9b67-9dfcf33e3296',
      cookie: `${mockSession.name}=${mockSession.value}; path=/; expires=Thu, 15 Oct 2030 15:36:43 GMT; domain=k4connect.com; httponly`,
      username: 'zach.durham@k4connect.com',
      roles: [3, 4, 9, 10, 11, 12, 13, 21, 22],
      permissions: [
        'AssociationRead',
        'AssociationWrite',
        'Calls',
        'ContentRead',
        'ContentWrite',
        'DocumentRead',
        'DocumentWrite',
        'EulaAccept',
        'KeychainCheckin',
        'KeychainRead',
        'MailAnnouncementWrite',
        'RoleRead',
        'RoleWrite',
        'UserEventsWrite',
        'UserRead',
        'UserWrite',
        'Zendesk',
      ],
      communities: [2476, 14],
      features: {
        '2476': {
          workOrders: true,
          domo: true,
        },
      },
      iat: 1602689803,
      exp: 1602776203,
      aud: 'staging',
      iss: 'k4api.io',
      sub: 'zach.durham@k4connect.com',
    },
    SECRET,
  );
}
