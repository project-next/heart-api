let common = [
	'integration-test',                // Specify our feature files
	'--require-module ts-node/register',    // Load TypeScript module
	'--require integration-test/step-definitions/**/*.ts',   // Load step definitions
	'--format summary',
	'--format html:integration-test-results.html',	// creates html report, colon separating format option and file name is required
	'--publish-quiet',
 ].join(' ');

 module.exports = {
	default: common
 };