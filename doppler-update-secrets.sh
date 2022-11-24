ENV=$1

doppler setup -p heart-api -c $ENV --no-interactive

cat certs/private.key | doppler secrets set SSL_PRIVATE_KEY
cat certs/ca_bundle.crt | doppler secrets set SSL_CA_BUNDLE_CRT
cat certs/certificate.crt | doppler secrets set SSL_CERTIFICATE_CRT
cat certs/mongoDB-heart-api-X509.pem | doppler secrets set MONGO_DB_SSL_CERT
cat certs/jwt.key | doppler secrets set JWT_PRIVATE_KEY
cat certs/jwt.pub | doppler secrets set JWT_PUBLIC_KEY