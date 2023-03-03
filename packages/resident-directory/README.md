# resident-directory
Application for resident management used in the caregiver dashboard. This is built in React and maintained by the Caregiver Experience Team.

## Running & Developing Locally
Branch off of `development` for any contributions to this repository.

Before starting, make sure you declare an environment variable `REACT_APP_LOCAL_TOKEN` and give it the value of a valid JWT that you received by logging into the 
FusionOS auth server. For more information check out that [repo](https://github.com/k4connect/fusionos-auth).

You can do this on a by terminal basis by running:

```
$ export REACT_APP_LOCAL_TOKEN="somejwtvaluereallylongstring"
```

or save it to a local `.bashrc`, or `.zshrc` file for longer term storage. Without this the application won't be able to send a valid JWT to the server, causing some functionality to fail.


```
$ npm start
```

Note that Apollo will be looking for a graphql service running on http://localhost:4000/graphql. Make sure you have [papi](https://github.com/k4connect/papi) running locally to make this happen.

The app will be served on http://localhost:3007

## Tests

This uses the default `create-react-app` configuration, so to run tests you can simply run 

```
$ npm test
```

The test runner, Jest, will look for files with the following naming conventions:

- Files with .js suffix in __tests__ folders
- Filters with .test.js suffix

## CI/CD

TBD

## Additional Info

TBD
