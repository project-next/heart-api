SERVER=$1
USER="ec2-user"

if [ $# -eq 0 ]
	then
		echo "Need server name"
fi

rsync -avz -e "ssh -i ~/.ssh/skc-server.pem" docker-compose.yml "${USER}@${SERVER}:heart-api/"
rsync -avz -e "ssh -i ~/.ssh/skc-server.pem" -r dist/* "${USER}@${SERVER}:heart-api/dist/"