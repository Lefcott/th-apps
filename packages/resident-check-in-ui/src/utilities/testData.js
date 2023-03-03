// testing mock data

const fakeResident = {
  guid: "37ab8fa1-08ff-4b3d-9601-1f4cf632cjd32",
  email: "leo10@gmail.com",
  alternateEmail: "leo.messi@k4connect.com",
  name: null,
  properties: null,
  associations: null,
  firstName: "Leo",
  lastName: "Messi",
  roomNumber: "MS - A",
  fullName: "Leo Messi",
  system: "7e70d24a-7541-45d4-b52c-db4ac9d93382",
  address: "MS - A",
  analyticsId: "65a517ad-2197-4e58-913f-185c3ee4w933",
  lastActivity: "2019-06-18 17:58:00.000UTC",
  lastActivityDevice: "Bathroom Outlet Motion",
  away: false,
  mute: false,
  statusDates: {
    startDate: "2019-06-06T04:00:00.000Z",
    endDate: "2019-06-09T03:59:59.000Z"
  },
  alerts: [
    {
      id: 3704,
      communityId: 4704,
      analyticsId: "65a517ad-2197-4e58-913f-185c3ee4c266",
      rule: "b84a8630-3901-4eab-af76-fc7a0c6cd19e",
      type: "alert",
      description: "No Activity Detected between 5am and 11am today.",
      actions: [
        "Saw Resident",
        "Spoke to Resident",
        "Can Not Reach Resident",
        "Other"
      ],
      status: "active",
      resolved: null,
      createdAt: "2019-06-09T15:00:23.000Z",
      updatedAt: "2019-06-09T15:00:23.000Z",
      AlertsAudits: [
        {
          guid: "31902eab-0388-4a7f-8dea-80ab751d7ac5",
          alert: 3704,
          actions: "{\"Created\":true}",
          user: null,
          communityId: 4704,
          notes: null,
          date: "2019-06-09T15:00:23.000Z"
        }
      ]
    },
    {
      id: 3559,
      communityId: 4704,
      analyticsId: "65a517ad-2197-4e58-913f-185c3ee4c266",
      rule: "07f27240-7ad1-439e-b5b3-6c240c998bc0",
      type: "alert",
      description: "No Activity Detected in the last 2 minutes.",
      actions: [
        "Saw Resident",
        "Spoke to Resident",
        "Can Not Reach Resident",
        "Other"
      ],
      status: "active",
      resolved: null,
      createdAt: "2019-06-04T17:53:49.000Z",
      updatedAt: "2019-06-04T17:53:49.000Z",
      AlertsAudits: [
        {
          guid: "7fa9a3b5-64b4-45c8-851c-95f7ecbb8e9f",
          alert: 3559,
          actions: "{\"Created\":true}",
          user: null,
          communityId: 4704,
          notes: null,
          date: "2019-06-04T17:53:49.000Z"
        }
      ]
    }
  ]
};

const fakeResidentTwo = {
  guid: "37ab8fa1-08ff-4b3d-9601-1f4cf655392",
  email: "Leroy10@gmail.com",
  alternateEmail: "Leroy.Sane@k4connect.com",
  name: null,
  properties: null,
  associations: null,
  firstName: "Leroy",
  lastName: "Sane",
  roomNumber: "MS - A",
  fullName: "Leroy Sane",
  system: "7e70d24a-7541-45d4-b52c-db4ac9d93382",
  address: "MS - A",
  analyticsId: "65a517ad-2197-4e58-913f-185c3ee4w933",
  lastActivity: "2019-06-18 17:58:00.000UTC",
  lastActivityDevice: "Bathroom Outlet Motion",
  away: false,
  mute: false,
  statusDates: {
    startDate: "2019-06-06T04:00:00.000Z",
    endDate: "2019-06-09T03:59:59.000Z"
  },
  alerts: [
    {
      id: 3704,
      communityId: 4704,
      analyticsId: "65a517ad-2197-4e58-913f-185c3ee4c266",
      rule: "b84a8630-3901-4eab-af76-fc7a0c6cd19e",
      type: "alert",
      description: "No Activity Detected between 5am and 11am today.",
      actions: [
        "Saw Resident",
        "Spoke to Resident",
        "Can Not Reach Resident",
        "Other"
      ],
      status: "active",
      resolved: null,
      createdAt: "2019-06-09T15:00:23.000Z",
      updatedAt: "2019-06-09T15:00:23.000Z",
      AlertsAudits: [
        {
          guid: "31902eab-0388-4a7f-8dea-80ab751d7ac5",
          alert: 3704,
          actions: "{\"Created\":true}",
          user: null,
          communityId: 4704,
          notes: null,
          date: "2019-06-09T15:00:23.000Z"
        }
      ]
    },
    {
      id: 3559,
      communityId: 4704,
      analyticsId: "65a517ad-2197-4e58-913f-185c3ee4c266",
      rule: "07f27240-7ad1-439e-b5b3-6c240c998bc0",
      type: "alert",
      description: "No Activity Detected in the last 2 minutes.",
      actions: [
        "Saw Resident",
        "Spoke to Resident",
        "Can Not Reach Resident",
        "Other"
      ],
      status: "active",
      resolved: null,
      createdAt: "2019-06-04T17:53:49.000Z",
      updatedAt: "2019-06-04T17:53:49.000Z",
      AlertsAudits: [
        {
          guid: "7fa9a3b5-64b4-45c8-851c-95f7ecbb8e9f",
          alert: 3559,
          actions: "{\"Created\":true}",
          user: null,
          communityId: 4704,
          notes: null,
          date: "2019-06-04T17:53:49.000Z"
        }
      ]
    }
  ]
};

const fakeResidents = [
  fakeResident,
  fakeResidentTwo
];

const fakeAlerts = [
  {
    id: 210,
    communityId: 2182,
    analyticsId: '6e705657-014d-4487-8644-2c572ff11a5a',
    rule: '358f6d82-7d98-41f6-beca-079a66044738',
    type: 'alert',
    description: 'Night Bathroom Activity Detected.',
    status: 'active',
    createdAt: '2019-01-05T01:21:27.000Z',
    updatedAt: '2019-01-05 01:21:27',
  },
  {
    id: 211,
    communityId: 2182,
    analyticsId: '879217b4-f222-40ec-a425-7fb71d82e4f0',
    rule: '358f6d82-7d98-41f6-beca-079a66044738',
    type: 'alert',
    description: 'Night Bathroom Activity Detected.',
    status: 'active',
    createdAt: '2019-01-05T01:22:26.000Z',
    updatedAt: '2019-01-05 01:22:26',
  },
  {
    id: 234,
    communityId: 2182,
    analyticsId: '6e705657-014d-4487-8644-2c572ff11a5a',
    rule: '6fbf8b06-b14f-466a-aaa7-0b7d5ad0440f',
    type: 'issue',
    description: 'No Activity Detected for 4 Hours',
    status: 'active',
    createdAt: '2019-01-05T15:25:27.000Z',
    updatedAt: '2019-01-05 15:25:27',
  },
  {
    id: 235,
    communityId: 2182,
    analyticsId: '879217b4-f222-40ec-a425-7fb71d82e4f0',
    rule: '6fbf8b06-b14f-466a-aaa7-0b7d5ad0440f',
    type: 'alert',
    description: 'No Activity Detected for 4 Hours',
    status: 'active',
    createdAt: '2019-01-05T15:25:27.000Z',
    updatedAt: '2019-01-05 15:25:27',
  },
  {
    id: 236,
    communityId: 2182,
    analyticsId: '8cfb42db-fc3a-47c7-afbc-eec3d781a904',
    rule: '6fbf8b06-b14f-466a-aaa7-0b7d5ad0440f',
    type: 'issue',
    description: 'No Activity Detected for 4 Hours',
    status: 'active',
    createdAt: '2019-01-05T15:25:27.000Z',
    updatedAt: '2019-01-05 15:25:27',
  },
  {
    id: 237,
    communityId: 2182,
    analyticsId: '89fa2572-7970-4c69-afd4-f72381c712a2',
    rule: '6fbf8b06-b14f-466a-aaa7-0b7d5ad0440f',
    type: 'alert',
    description: 'No Activity Detected for 4 Hours',
    status: 'active',
    createdAt: '2019-01-05T15:25:27.000Z',
    updatedAt: '2019-01-05 15:25:27',
  },
  {
    id: 238,
    communityId: 2182,
    analyticsId: '6748c710-e873-4bbf-9a34-c31e05b50917',
    rule: '6fbf8b06-b14f-466a-aaa7-0b7d5ad0440f',
    type: 'alert',
    description: 'No Activity Detected for 4 Hours',
    status: 'active',
    createdAt: '2019-01-05T15:25:27.000Z',
    updatedAt: '2019-01-05 15:25:27',
  }
];

export {
  fakeAlerts,
  fakeResident,
  fakeResidents
};
