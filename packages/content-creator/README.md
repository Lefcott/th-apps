# Content Builder

Content Builder is built in AngularJS and maintained by the Care Delivery team. This app is used as a content creation & editor tool that allows for data-driven widgets.

## Running & Developing Locally

Work off of the ```development``` branch.

#### Two ways to run the Content Builder locally
1. Start the ```Dashboard``` up locally (easiest)
From within the ```Dashboard```, open the ```packages/K4Core/src/controller.K4EndpointController.js``` file and configure ```api.local``` to the ```staging``` environment and make sure ```creator.local``` is pointed at ```http://localhost:9001```.

```bash
$ npm start
```

2. Stand alone
Open the ```submit.component.js``` file found in ```app/components/content_editor/submit``` and comment out ```this.document``` in the ```constructor``` as well as the ```$onInit()``` function.


```bash
$ npm start
```

Application will be served on http://localhost:9001/.

Open up the ```Dashboard``` in the ```staging``` environment. Find any document you want to work off of and open in the ```Creator```. Select the canvas with your console inspector tool. Find the iframe and copy the ```src``` query parameters. These will be your ***required query parameters***

```http://localhost:9001/?communityId=14&communityName=Operational%20Test%20Bed&user=59397467-be10-4a13-a9c7-3271b1418a89&documentId=250a615b-f314-46d1-b58a-a2003ebe162e&type=slideshow&documentName=ma%201&editorRole=Editor&orientation=Digital-Landscape#!/```

**Additional Information**
The page will reload automatically if any edits are saved

Configure 'local' addresses in ```app/services/url.service.js``` to point at different environments or to coincide with other projects running locally.
- By default this app is set to point at the ```staging``` environment when running on localhost

## CI/CD

Pull requests should be compared against the ```development``` branch. Integration requires at least two approving reviews in order to merge a pull request.

Continuous delivery is done through AWS CodePipeline under the name ```Creator```. There is a manual process to deploy the newest changes into dev, test, staging, etc. environments.

## Useful Information

#### File Locations
- The UI tool components can be found in the ```app/components/content_editor``` directory
- The services can be found in the ```app/services``` directory

#### AngularJS Documentation
- Documentation including API references can be found [here](https://docs.angularjs.org/api)

#### Update Requests
- Bugs and improvements can be reported in this [Asana Board](https://app.asana.com/0/630316484404151/630316484404151)
- Feature requests added to Asana backlog by PMs only. Contact Diana Gore.

#### Contacts
Main developers for any questions/concerns about this project's code are Anthony Sist and Darren Evans
