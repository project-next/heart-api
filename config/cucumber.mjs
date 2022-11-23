const config = {
	paths: ['integration-test'],
	import: ['integration-test/step-definitions/**/*.ts'],
	format: ['summary', 'progress-bar', 'html:integration-test-results.html'],
	publishQuiet: true,
}
export default config
