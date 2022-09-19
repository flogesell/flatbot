#!/bin/sh
# This script should be executed from the project root dir


PSQL_VOLUME_NAME=postgres-flatbot-volume
PSQL_CONTAINER_NAME=flatbot-psql



export $(cat .env.dev | xargs)



docker rm -f $(docker ps -a -q --filter="name=$PSQL_CONTAINER_NAME")
docker volume rm -f $PSQL_VOLUME_NAME
docker volume create $PSQL_VOLUME_NAME
docker run --rm --name $PSQL_CONTAINER_NAME -d -p 5432:5432 -v postgres-volume:/var/lib/postgresql/data -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DATABASE postgres:alpine

# // docker rmi postgres:alpine -f
# // docker container rm $(docker ps -a -q --filter="name=local-postgres")
# // docker logs -t local-postgres
#
# // docker rm $(docker ps -a -q)
# // docker rmi -f $(docker images -q)
#
# // TESTING
# // docker rm $(docker ps -a -q)
# // npm run build:docker-postgres
