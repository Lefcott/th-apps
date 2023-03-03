<!-- @format -->

# Digital Signage Manager

The DSM is a TeamHub module that is built and maintained byt he Caregiver Experience team. It's purpose is to enable caregivers to publish content to digital signage displays around their communities.

## To run locally

To start the project, you can run `npm start -- --https`

[To see a complete guide on developing TeamHub modules locally, click here](https://k4connect.atlassian.net/wiki/spaces/ENGINEERING/pages/524713994/Local+Development+Setup+for+TeamHub+Apps)

## Developing for legacy Extjs Dashboard

Check out off of `development-legacy` to get code that is compatible with the old dashboard. To run, simply execute `npm start` in the command line. Make sure you have a local `REACT_APP_LOCAL_TOKEN` stored
as an environment variable to authenticate API calls with.

## CI/CD

This project is bundled and deployed using Github Actions. All executions of actions can be viewed in the Actions tab of the Github repositiory [here](https://github.com/k4connect/content-management/actions). All workflows are defined in the `.github/workflows` directory and can be modified there.

## Build Configuration

Check the `webpack.config.js` config to learn more about how webpack is bundling the project. Because this is a `single-spa` module, the config uses some default configuration provided by the `single-spa-webpack-react` module. To see that config you can go to the github docs [here](https://github.com/single-spa/create-single-spa/tree/master/packages/webpack-config-single-spa).

# Digital Signage Manager

Digital Signage Manager is built in React and maintained by the Care Delivery team. This app allows staff to view existing and add new document schedules to Digital Signage.

## Running & Developing Locally

Work off of the `development` branch.

```bash
$ npm start
```

Application will be served on http://localhost:3003/.

#### Required query parameters

- communityId - integer
  `http://localhost:3003/?communityId=14`

The page will reload automatically if any edits are saved

Configure 'local' addresses in `src/utilities/url-service.js` to point at different environments or to coincide with other projects running locally.

- By default this app is set to point at the dev environment when running on localhost

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

Continuous delivery is done through AWS CodePipeline under the name `Publish-Manager-ui`. Once code is pushed into the development branch, there is a automatic deployment for the newest changes to the dev environment. There is a manual process to deploy the newest changes into test, staging, etc. environments.

## APIs

The configuration for the API layer can be found inside the `src/apis` directory, which interfaces mostly with K4Connect's `document` service.
