createEnvFile() {
  local DOPPLER_CONFIG=$1
  
  doppler secrets --config $DOPPLER_CONFIG download --no-file --format json | jq "{$DOPPLER_CONFIG: {YOUTUBE_API_KEY: .YOUTUBE_API_KEY, HEART_API_KEY: .HEART_API_KEY, HEART_API_DB_BASE_URI: .HEART_API_DB_BASE_URI, MORGAN_LOG_LEVEL: .MORGAN_LOG_LEVEL}}" > .env.${DOPPLER_CONFIG}.json
}

ENV=$1

doppler setup -p heart-api -c $ENV --no-interactive

mkdir certs
doppler secrets get --plain SSL_PRIVATE_KEY > certs/private.key
doppler secrets get --plain SSL_CA_BUNDLE_CRT > certs/ca_bundle.crt
doppler secrets get --plain SSL_CERTIFICATE_CRT > certs/certificate.crt
doppler secrets get --plain MONGO_DB_SSL_CERT > certs/mongoDB-heart-api-X509.pem
doppler secrets get --plain JWT_PRIVATE_KEY > certs/jwt.key
doppler secrets get --plain JWT_PUBLIC_KEY > certs/jwt.pub

createEnvFile dev
createEnvFile prod
createEnvFile test

jq --tab -s '.[0] * .[1] * .[2]' .env.dev.json .env.test.json .env.prod.json > .env-cmdrc.json
rm .env.dev.json .env.test.json .env.prod.json