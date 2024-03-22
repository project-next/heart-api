HOST_NAME="heart-api.com"

# get ARN using the hostname, update certs using ARN
ARN=$(aws acm list-certificates --query 'CertificateSummaryList[*].[CertificateArn,DomainName]' --output text | grep -F "$HOST_NAME"  | cut -f 1)
echo "Updating $ARN certificate info"

aws acm import-certificate --certificate-arn "$ARN" \
  --certificate "fileb://certs/certificate.crt" --certificate-chain "fileb://certs/ca_bundle.crt" --private-key "fileb://certs/private.key" > /dev/null