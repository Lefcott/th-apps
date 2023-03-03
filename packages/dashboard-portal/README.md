# Dashboard Portal

The Dashboard Portal is built in React and maintained by the Care Delivery team. This page is the landing page to the dashboard and helps the user navigate to various places in the dashboard.

## Running & Developing Locally

- Work off of the `development` branch.

- to install the dependencies

```bash
$ npm install
```

- to start the application

```bash
$ npm start
```

Application will be served on http://localhost:3009/.

## Testing

#### Running Tests Locally

```bash
$ npm test
```

[Jest](https://jestjs.io/docs/en/getting-started) will look for test files with the following naming conventions

- Files with `.js` suffix in `__tests__` folders
- Files with `.test.js` suffix

By default, when you run `npm test`, Jest will only run the tests related to files changed since the last commit. You can press `a` in the watch mode to force Jest to run all tests.

## CI/CD

Pull requests should be compared against the `development` branch. Integration requires at least two approving reviews in order to merge a pull request.

Continuous delivery is done through AWS CodePipeline under the name `dashboard-portal`. Once code is pushed into the development branch, there is a automatic deployment for the newest changes to the dev environment. There is a manual process to deploy the newest changes into test, staging, etc. environments.

## Useful Information

#### Feature Flagging
- This Project uses LaunchDarkly to implement feature flagging.
- You can search the project for all features wrapped in a flag by searching for `feature-flag'
- All wrapped features need to have been tagged with `/* feature-flag */` for high visibility.
- Follow the LaunchDarkly best practices.
- https://github.com/launchdarkly/featureflags

#### File Locations

- The UI components can be found in the `src/components` directory
- The API layer that bridges the `Document` service can be found in the `src/apis` directory

#### Reactstrap Documentation

- Documentation including grid layout and ui components can be found [here](https://reactstrap.github.io/)

#### Update Requests

- Bugs and improvements can be reported in this [Asana Board](https://app.asana.com/0/630316484404151/630316484404151)
- Feature requests added to Asana backlog by PMs only. Contact Diana Gore.

#### Contacts

Main developers for any questions/concerns about this project's code are Anthony Sist, Darren Evans, and Brandon Goodfliesh.
