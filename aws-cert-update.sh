ARN=$(doppler secrets get -p heart-api -c prod --plain SSL_CERT_AWS_ARN)

aws acm import-certificate --certificate-arn "$ARN" \
  --certificate "fileb://certs/certificate.crt" --certificate-chain "fileb://certs/ca_bundle.crt" --private-key "fileb://certs/private.key" > /dev/null

echo "Updated ARN $ARN"