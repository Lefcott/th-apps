# Resident Check-in UI

This is the Resident Check-In TeamHub module.

## Running & Developing Locally

### Teamhub

This section is for developing against the new TeamHub single-spa framework.

[Setting up local development](https://k4connect.atlassian.net/wiki/spaces/ENGINEERING/pages/524713994/Local+Development+Setup+for+TeamHub+Apps)

Make sure you have a local `.env` file in the root with a `K4_ENV` var set to `dev` or `staging` which will trigger the application to target the selected environment when making API calls.

### Legacy Extjs Dashboard 

Work off of ```development-legacy``` branch and see the README on that branch.

## Testing

Unit tests are run automatically on each branch push to Github (by a Github Action)

Test configuration is stored in `jest.config.js` in the root

### Running Tests Locally

If you'd like to run tests locally:

```bash
$ npm test
```


## CI/CD

Pull requests should be compared against the `development` branch. Integration requires at least two approving reviews in order to merge a pull request. Once PRs have been merged into `development` the code will be automatically deployed using Github Actions to the `dev` and `staging` environments. 

Releases are cut off of `development` and merged into `master`. Once code is in `master`, you can run a manual trigger in the Actions tab of Github to push the code to the `production` environment. 

## Useful Information

#### File Locations
- The UI components can be found in the ```src/components``` directory
- The API layer that bridges the Check-in service can be found in the ```src/apis``` directory

#### Contacts
Caregiver Experience Team
