mkdir certs
echo "$HEART_API_SSL_PRIVATE_KEY" > certs/private.key
echo "$HEART_API_SSL_CA_BUNDLE_CRT" > certs/ca_bundle.crt
echo "$HEART_API_SSL_CERTIFICATE_CRT" > certs/certificate.crt
echo "$HEART_API_MONGO_DB_SSL_CERT" > certs/mongoDB-heart-api-X509.pem
# throwaway JWT key pair, tests sign and verify their own tokens so the real keys aren't needed
openssl genrsa -out certs/jwt.key 2048
openssl rsa -in certs/jwt.key -pubout -out certs/jwt.pub
