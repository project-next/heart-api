mkdir certs
echo "${{ steps.doppler.outputs.SSL_PRIVATE_KEY }}" > certs/private.key
echo "${{ steps.doppler.outputs.SSL_CA_BUNDLE_CRT }}" > certs/ca_bundle.crt
echo "${{ steps.doppler.outputs.SSL_CERTIFICATE_CRT }}" > certs/certificate.crt
echo "${{ steps.doppler.outputs.MONGO_DB_SSL_CERT }}" > certs/mongoDB-heart-api-X509.pem
echo "${{ steps.doppler.outputs.JWT_PRIVATE_KEY }}" > certs/jwt.key
echo "${{ steps.doppler.outputs.JWT_PUBLIC_KEY }}" > certs/jwt.pub
