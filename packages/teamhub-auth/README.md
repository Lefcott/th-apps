<!-- @format -->

# Team Hub Auth

This is the login page and corresponding logic for the Team Hub.

## Local Setup and Dev

To start, run `npm i` to install all dependencies. Note that you will need Node v10.x or above.

To run locally, run `npm start -- --https`, which will start the application on port `3010`. To run inside the teamhub-app-shell, see the docs [here](https://k4connect.atlassian.net/wiki/spaces/ENGINEERING/pages/524713994/Local+Development+Setup+for+TeamHub+Apps).

## Tests

To run the test suite, run `npm run test`. These are run automatically on push to any branch in Github through the action in `.github/workflows/test.yml`.

Tests are in `src/__tests__`, mocks are in `src/__mocks__`. This repo takes advantange of `mock-service-workers` to intercept fetch requests and mock server responses. To see/edit the test server, check out the `__tests__/test-utils/mock-server` directory.

## Raygun Reporting

This repository uses raygun to report errors. That code lives in `src/utils/raygun.js`

## Deployments

This project is deployed using the K4 Jenkins build server. To deploy it to `dev`, `staging`, or `production`, use the corresponding `build-teamhub-micros-<env>` pipeline in jenkins. `dev` and `staging` are currently automatically deployed upon merging branches into `development`. This repo is set to automatically deploy to `dev` and `staging` when pull requests are merged into the `development` branch.
