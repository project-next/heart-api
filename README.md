# heart-api

## Description

This API provides various information to other services. Information includes:

- YouTube Data
  - Metadata on particular video
  - Recent upload info
  - New give away for particular video - API will pick a winner randomly from all people commenting and who give the required code
- Social media posts (not yet implemented)
- News for services (not yet implemented)
- Calendar showing important upcoming dates for services (not yet implemented)

In the end, any and all Websites, channels and podcasts will use this API to get social media info and communication.

## NPM Scripts

Like all NPM applications, package.json will contain all scripts needed to run, test and deploy this API. Check the table below for info on each script.

| Script Name | Description |
| ----------- | ----------- |
| unit-test   | Uses mocha scripts to execute unit tests |
| integration-test | Executes integration tests |

## Node Packages Used

### Unit Testing

For unit testing both [mocha](https://mochajs.org) and [istanbul](https://istanbul.js.org) (nyc) are used.

Mocha is used to execute and create the unit tests but since mocha doesn't have code coverage built in, istanbul is used to check how well unit tests are being written.

Unit tests require certain env variables that are configured during script execution. However, a file called *.env-cmdrc.json* is needed in the root directory. This file is not included in the GitHub repo since it exposes some sensitive information used when building builds.

### Integration Tests

[Cucumber.js](https://github.com/cucumber/cucumber-js/tree/master) is the only library used to create and execute integration tests. The file *cucumber.js* includes configurations to modify the default functionality of the library.
