/** @format */

export const useCurrentUser = () => {
  return [
    {
      _id: 'coolid',
      fullName: 'Cool Fella',
      firstName: 'Cool',
      lastName: 'Fella',
      community: {
        timezone: 'America/New_York',
        name: 'Cool community',
        urls: ['https://http.cat'],
      },
    },
    false,
    null,
  ];
};

export const navigate = () => null;

export const getAuthToken = () => 'faketoken';
