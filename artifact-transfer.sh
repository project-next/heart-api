server=$1
user="ec2-user"

if [ $# -eq 0 ]
	then
		echo "Need server name"
fi

ssh -i ~/.ssh/skc-server-creds.pem "${user}@${server}" << EOF
	mkdir heart-api
EOF

sftp -i ~/.ssh/skc-server-creds.pem "${user}@${server}" << EOF
	cd heart-api
	put docker-compose.yml
	put -r dist/
EOF