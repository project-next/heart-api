// Bundles the API and its dependencies into dist/ so the server doesn't need node_modules
import { build } from 'esbuild'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const envConfig = JSON.parse(fs.readFileSync('./.env-cmdrc.json', 'utf8'))

// only files the app reads are shipped - prevents stray files in certs/ (temp secret files, .DS_Store) from being deployed
const CERT_FILES = ['private.key', 'certificate.crt', 'ca_bundle.crt', 'jwt.key', 'jwt.pub', 'mongoDB-heart-api-X509.pem']
const OWNER_READ_WRITE = 0o600 // secrets shouldn't be readable by other users on the server, rsync preserves permissions

fs.rmSync('./dist', { recursive: true, force: true })

await build({
	entryPoints: ['./src/app.ts'],
	outfile: './dist/app.mjs',
	bundle: true,
	platform: 'node',
	format: 'esm',
	target: 'node24',
	sourcemap: true,
	sourcesContent: false, // stack traces only need the mappings, keeps source code out of the map
	// CJS deps (express, mongoose, etc) call require() - ESM output doesn't have it unless it's created
	banner: { js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" },
	// npm_package_version is only set when started via npm/yarn, app is started with node directly
	define: { 'process.env.npm_package_version': JSON.stringify(pkg.version) },
})

fs.mkdirSync('./dist/certs')
for (const certFile of CERT_FILES) {
	fs.copyFileSync(`./certs/${certFile}`, `./dist/certs/${certFile}`)
	fs.chmodSync(`./dist/certs/${certFile}`, OWNER_READ_WRITE)
}

// prod env vars, read by node --env-file - values are written unquoted so characters the .env parser treats specially aren't allowed
const prodEnv = Object.entries(envConfig.prod).map(([key, value]) => {
	if (/[\n\r#"'`]/.test(value)) {
		throw new Error(`Env var ${key} has a newline, # or quote which node --env-file won't read correctly`)
	}
	return `${key}=${value}`
})
fs.writeFileSync('./dist/.env', `${prodEnv.join('\n')}\n`, { mode: OWNER_READ_WRITE })
