let common = [
	'integration-test',                // Specify our feature files
	'--require-module ts-node/register',    // Load TypeScript module
	'--require **/step-definitions/**/*.ts',   // Load step definitions
	'--publish-quiet',
 ].join(' ');

 module.exports = {
	default: common
 };