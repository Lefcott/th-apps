<!-- @format -->

# TeamHub App Content Manager

Module used for publishing content to audiences.

## Developing locally

[Setting up local development environment](https://k4connect.atlassian.net/wiki/spaces/ENGINEERING/pages/524713994/Local+Development+Setup+for+TeamHub+Apps)

## Developing for legacy Extjs Dashboard

Check out off of `development-legacy` to get code that is compatible with the old dashboard. To run, simply execute `npm start` in the command line. The project will start on `http://localhost:1235`. Make sure you have a local `REACT_APP_LOCAL_TOKEN` stored as an environment variable to authenticate API calls with. See the code in `src/utils/environment.js` to see how it's used.

## CI/CD

This project is bundled and deployed using Github Actions. All executions of actions can be viewed in the Actions tab of the Github repositiory [here](https://github.com/k4connect/content-management/actions). All workflows are defined in the `.github/workflows` directory and can be modified there.

## Build Configuration

Check the `webpack.config.js` config to learn more about how webpack is bundling the project. Because this is a `single-spa` module, the config uses some default configuration provided by the `single-spa-webpack-react` module. To see that config you can go to the github docs [here](https://github.com/single-spa/create-single-spa/tree/master/packages/webpack-config-single-spa).
