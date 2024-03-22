createEnvFile() {
  local env=$1

  aws secretsmanager get-secret-value --secret-id "/${env}/project-next/heart-api/env" --region us-east-2 | jq -r '.SecretString' | jq -S ". + $2" > .env.${env}.json
}

mkdir -p certs

aws secretsmanager get-secret-value --secret-id "/prod/project-next/heart-api/ssl" --region us-east-2 \
  | jq -r '.SecretString' \
  | jq -r "with_entries(select(.key | startswith(\"SSL\")))" > certs/base64-certs-json
jq -r ".SSL_PRIVATE_KEY" < certs/base64-certs-json | base64 -d > certs/private.key
jq -r ".SSL_CA_BUNDLE_CRT" < certs/base64-certs-json | base64 -d > certs/ca_bundle.crt
jq -r ".SSL_CERTIFICATE_CRT" < certs/base64-certs-json | base64 -d > certs/certificate.crt

aws secretsmanager get-secret-value --secret-id "/prod/project-next/heart-api/jwt" --region us-east-2 \
  | jq -r '.SecretString'  > certs/base64-certs-json
jq -r ".JWT_PRIVATE_KEY" < certs/base64-certs-json | base64 -d > certs/jwt.key
jq -r ".JWT_PUBLIC_KEY" < certs/base64-certs-json | base64 -d > certs/jwt.pub

aws secretsmanager get-secret-value --secret-id "/prod/project-next/heart-api/db" --region us-east-2 \
  | jq -r '.SecretString'  > certs/base64-certs-json
jq -r ".DB_PEM" < certs/base64-certs-json | base64 -d > certs/mongoDB-heart-api-X509.pem

rm certs/base64-certs-json


DB_HOST=$(aws secretsmanager get-secret-value --secret-id "/prod/project-next/heart-api/db" --region us-east-2 \
  | jq -r '.SecretString' \
  | jq -c "with_entries(select(.key | startswith(\"DB_HOST\")))")
createEnvFile dev "$DB_HOST"
createEnvFile prod "$DB_HOST"
cp .env.dev.json .env.test.json

jq --tab -s '{"dev": .[0], "test": .[1], "prod": .[2]}' .env.dev.json .env.test.json .env.prod.json > .env-cmdrc.json
rm .env.dev.json .env.test.json .env.prod.json