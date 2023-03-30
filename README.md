# heart-api
[![Unit Test & Code Quality](https://github.com/project-next/heart-api/actions/workflows/unit-test.yaml/badge.svg)](https://github.com/project-next/heart-api/actions/workflows/unit-test.yaml)

## Description

This API provides various information to other services. Information includes:

- YouTube Data
  - Metadata on particular video
  - Recent upload info
  - Give away for particular video - API will pick a winner randomly from all people commenting and who give the required code
- Social media posts (not yet implemented)
- General messages to users of a service - MongoDB is leveraged to store messages
- Upcoming events - shows time/date of an upcoming event for a particular service - MongoDB is leveraged to store messages

In the end, any and all Websites, channels and podcasts will use this API to get social media info and communication.

## Certificate Renewal/Change

You will need to create a new cert from ZeroSSL and validate the domain is yours. Select the owner email provided not admin.

You will need to upload a new cert when the old one expires in AWS. The cert location is us-east-2 (Ohio).

## NPM Scripts

Like all NPM applications, package.json will contain all scripts needed to run, test and deploy this API. Check the table below for info on each script.

| Script Name | Description |
| ----------- | ----------- |
| unit-test   | Uses mocha scripts to execute unit tests |
| integration-test | Executes integration tests |

## Node Packages Used

### Unit Testing

For unit testing both [mocha](https://mochajs.org) and [c8](https://github.com/bcoe/c8) are used.

Mocha is used to execute and create the unit tests but since mocha doesn't have code coverage built in, c8 is used to check how well unit tests are being written.

Unit tests require certain env variables that are configured during script execution. However, a file called *.env-cmdrc.json* is needed in the root directory. This file is not included in the GitHub repo since it exposes some sensitive information used when building builds.

### Integration Tests

[Cucumber.js](https://github.com/cucumber/cucumber-js/tree/master) is the only library used to create and execute integration tests. The file *cucumber.js* includes configurations to modify the default functionality of the library.
