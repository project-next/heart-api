SSL_SECRET_MANAGER_ID="/prod/project-next/heart-api/ssl"

# AWS will remove new line characters, which are needed in below files - converting to base64 at the time of saving will resolve this issue
SSL_PRIVATE_KEY=$(base64 certs/private.key)
SSL_CA_BUNDLE_CRT=$(base64 certs/ca_bundle.crt)
SSL_CERTIFICATE_CRT=$(base64 certs/certificate.crt)

# take current secrets and update the values associated with SSL files - then increment the secret version using today's date
CERT_FILE_VALUES="{\"SSL_PRIVATE_KEY\": \"$SSL_PRIVATE_KEY\", \"SSL_CA_BUNDLE_CRT\": \"$SSL_CA_BUNDLE_CRT\", \"SSL_CERTIFICATE_CRT\": \"$SSL_CERTIFICATE_CRT\"}"
UPDATED_SECRETS_STRING=$(aws secretsmanager get-secret-value --secret-id "$SSL_SECRET_MANAGER_ID" --region us-east-2 | jq -r  '.SecretString' | jq ".  + $CERT_FILE_VALUES")
aws secretsmanager put-secret-value --secret-id "$SSL_SECRET_MANAGER_ID" --region us-east-2 --secret-string "$UPDATED_SECRETS_STRING" --no-cli-pager --version-stages "$(date +%F)" "AWSCURRENT"

#############################################
JWT_SECRET_MANAGER_ID="/prod/project-next/heart-api/jwt"

# AWS will remove new line characters, which are needed in below files - converting to base64 at the time of saving will resolve this issue
JWT_PRIVATE_KEY=$(base64 certs/jwt.key)
JWT_PUBLIC_KEY=$(base64 certs/jwt.pub)

JWT_FILE_VALUES="{\"JWT_PRIVATE_KEY\": \"$JWT_PRIVATE_KEY\", \"JWT_PUBLIC_KEY\": \"$JWT_PUBLIC_KEY\"}"
JWT_SECRET_STRING=$(aws secretsmanager get-secret-value --secret-id "$JWT_SECRET_MANAGER_ID" --region us-east-2 | jq -r  '.SecretString' | jq ".  + $JWT_FILE_VALUES")
aws secretsmanager put-secret-value --secret-id "$JWT_SECRET_MANAGER_ID" --region us-east-2 --secret-string "$JWT_SECRET_STRING" --no-cli-pager --version-stages "$(date +%F)" "AWSCURRENT"

#############################################
DB_SECRET_MANAGER_ID="/prod/project-next/heart-api/db"

# AWS will remove new line characters, which are needed in below files - converting to base64 at the time of saving will resolve this issue
DB_PEM=$(base64 certs/mongoDB-heart-api-X509.pem)

DB_VALUES="{\"DB_PEM\": \"$DB_PEM\"}"
DB_SECRET_STRING=$(aws secretsmanager get-secret-value --secret-id "$DB_SECRET_MANAGER_ID" --region us-east-2 | jq -r  '.SecretString' | jq  ".  + $DB_VALUES")
aws secretsmanager put-secret-value --secret-id "$DB_SECRET_MANAGER_ID" --region us-east-2 --secret-string "$DB_SECRET_STRING" --no-cli-pager --version-stages "$(date +%F)" "AWSCURRENT"