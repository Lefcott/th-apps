/** @format */
const envUrls = {
  local: 'https://api-staging.k4connect.com/v2/sso',
  dev: 'https://api-dev.k4connect.com/v2/sso',
  staging: 'https://api-staging.k4connect.com/v2/sso',
  production: 'https://api.k4connect.com/v2/sso',
};

const getSSO = () => envUrls[process.env.K4_ENV];

export default class MailService {
  constructor() {
    this.baseUrl = getSSO();
  }

  fetchMailInfo = async (communityId) => {
    const res = await fetch(
      `${this.baseUrl}/mailAnnouncement?communityId=${communityId}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.ok) {
      return res.json();
    }

    console.error('error fetching community mail info');
    return null;
  };

  announceMailIsHere = async (communityId, date) => {
    const res = await fetch(`${this.baseUrl}/mailAnnouncement`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        communityId,
        mailArrivalTime: date,
      }),
    });

    if (res.ok) {
      return res.status;
    }

    return null;
  };
}
