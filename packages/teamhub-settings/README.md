# teamhub-settings

## Running Locally

Set up a .env file with like so:

```bash
K4_ENV=dev # this must be a value of dev, staging, or production
FONT_AWESOME_NPM_TOKEN # if you don't have access to this value, ask an engineer on the caregiver experience team
```

Once you have done that, run `npm start` to start the project on `https://localhost:3200`.

Once that's running, you can update your importmaps in the Team Hub to point to your locally running instance. For more details, see the complete single-spa instructions [here](https://k4connect.atlassian.net/wiki/spaces/ENGINEERING/pages/524713994/Local+Development+Setup+for+TeamHub+Apps).
