let common = [
	'integration-test',                // Specify our feature files
	'--require-module ts-node/register',    // Load TypeScript module
	'--require **/step-definitions/**/*.ts',   // Load step definitions
 ].join(' ');

 module.exports = {
	default: common
 };