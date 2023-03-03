import { sortBy } from 'lodash';

export const getAlerts = (users = [], alertStatus, optOut) => {
  const sortedUsers = sortBy(
    users.filter((user) => user.alerts?.length > 0),
    (user) => `${user.lastName} ${user.firstName}`.toUpperCase()
  );

  // we're creating an array for each alert, so if a user has 2 alerts
  // allAlerts would contain two userRecords, one for each alert
  const allAlerts = sortedUsers.reduce((acc, user) => {
    const alerts = user.alerts.map((alert) => {
      const clone = { ...user, alert };
      return clone;
    });

    return acc.concat(alerts);
  }, []);

  const filteredAlerts = allAlerts.filter((user) => {
    if (typeof optOut !== 'undefined') {
      return user.alert.status === alertStatus && user.optOut === optOut;
    } else {
      return user.alert.status === alertStatus;
    }
  });

  return filteredAlerts;
};
