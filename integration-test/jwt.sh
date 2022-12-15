echo "------------------------------------------------------"
export HEART_API_KEY=`cat .env-cmdrc.json | jq -r '.["prod"]["HEART_API_KEY"]'`
echo "Using Key: $HEART_API_KEY"
echo

export HEART_API_JWT=`curl -s  --location --request GET 'https://heart-api.com/api/v1/auth/jwt' --header "heart-api-key: ${HEART_API_KEY}" | jq -r '.["jwt"]'`
echo "JWT configured in env: $HEART_API_JWT"
echo "------------------------------------------------------"
echo