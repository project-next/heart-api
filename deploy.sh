if [ $# -eq 0 ]
	then
		echo "Need server name"
		exit 1
fi

SERVER=$1
USER="ec2-user"
DIR_ON_SERVER="api/heart-api"

echo "Using server $SERVER and directory $DIR_ON_SERVER to sync prod API"

echo "Uploading API files"
rsync -avz -e "ssh -i ~/.ssh/project-next.pem" docker-compose.yml "${USER}@${SERVER}:${DIR_ON_SERVER}/"
rsync -avz --delete --exclude node_modules -e "ssh -i ~/.ssh/project-next.pem" -r dist/ "${USER}@${SERVER}:${DIR_ON_SERVER}/dist/"

echo "Restaging API"
ssh -i ~/.ssh/project-next.pem "${USER}@${SERVER}" << EOF
	cd "$DIR_ON_SERVER"
	docker-compose kill
	docker-compose rm -f
	docker-compose pull
	docker-compose up -d
EOF

bash aws-cert-update.sh