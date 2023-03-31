mkdir certs
echo "$HEART_API_SSL_PRIVATE_KEY" > certs/private.key
echo "$HEART_API_SSL_CA_BUNDLE_CRT" > certs/ca_bundle.crt
echo "$HEART_API_SSL_CERTIFICATE_CRT" > certs/certificate.crt
echo "$HEART_API_MONGO_DB_SSL_CERT" > certs/mongoDB-heart-api-X509.pem
echo "$HEART_API_JWT_PRIVATE_KEY" > certs/jwt.key
echo "$HEART_API_JWT_PUBLIC_KEY" > certs/jwt.pub
