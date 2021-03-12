#!/bin/bash
echo "🤓 Greetings 🐺 Yo!!!"

# Check if docker is installed on the system and use
if [ -x "$(command -v docker)" ]
then
    echo "********** Docker is installed **********"
    # $1 is for publisher container name eg. http-pubsub
    # $2 is for publisher image name rg. itssadon/http-pubsub
    # $3 is for subscriber container name eg. http-pubsub-client
    # $4 is for subscriber image name rg. itssadon/http-pubsub-client

    # Stop any running instance of container
    docker container stop redis-server
    docker container stop $1
    docker container stop $3

    # Remove container
    docker container rm redis-server
    docker container rm $1
    docker container rm $3

    # Remove docker image from system
    docker image rm $2
    docker image rm $4

    # Run container with image
    docker container run -d --name redis-server -p 6379:6379 redis
    
    RETRY=3
    while [ $RETRY -gt 0 ]
    do
        # Check if redis is running and the start publisher
        if [ -x "$(command -v redis-cli)" ]
        then
            REDIS_HOST="$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis-server)"
            echo "********** Redis is running on $REDIS_HOST:6379 **********"

            # Build and run the publisher
            cd server/ && docker image build --build-arg REDIS_HOST=$REDIS_HOST -t $2 . && cd ../
            docker container run -d --restart on-failure --name $1 -p 8000:8000 $2

            # Build and run the subsciber
            cd client/ && docker image build --build-arg REDIS_HOST=$REDIS_HOST -t $4 . && cd ../
            docker container run -d --restart on-failure --name $3 -p 9000:9000 $4

            # Wait for 2 second before sending test request
            echo "********** Waiting for 2 seconds **********"
            sleep 2

            # Subscribe to a topic1
            echo "********** Test1: subscribing to topic 1 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"url":"http://localhost:9000/test1"}' http://localhost:8000/subscribe/topic1
            echo $'\n'

            # Subscribe to topic2
            echo "********** Test2: subscribing to topic 2 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"url":"http://localhost:9000/test2"}' http://localhost:8000/subscribe/topic2
            echo $'\n'

            # Publish to topic1 subscribers
            echo "********** Test1: publishing to topic 1 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"messge": "big hello"}' http://localhost:8000/publish/topic1
            echo $'\n'

            # Publish to topic2 subscribers
            echo "********** Test1: publishing to topic 2 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"messge": "another hello"}' http://localhost:8000/publish/topic2
            echo $'\n'

            echo "********** Waiting for 2 seconds **********"
            sleep 2

            echo "********** Spin up a new subscriber **********"
            NEW_NAME="$31"
            docker container run -d --restart on-failure -e PORT=9001 --name $NEW_NAME -p 9001:9001 $4

            # Wait for 2 second before sending test request
            echo "********** Waiting for 2 seconds **********"
            sleep 2

            # Subscribe to topic2
            echo "********** Test3: subscribing to topic 1 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"url":"http://localhost:9001/test3"}' http://localhost:8000/subscribe/topic1
            echo $'\n'

            # Publish to topic2 subscribers
            echo "********** Test3: publishing to topic 1 **********"
            curl -X POST -H "Content-Type: application/json" -d '{"messge": "final hello"}' http://localhost:8000/publish/topic1
            echo $'\n'
            break
        else
            echo "********** Retrying Again **********" >&2
            # restart the server
            docker container stop redis-server
            docker container run -d --name redis-server -p 6379:6379 redis
            let RETRY-=1
            sleep 5
        fi
    done
else
    # Just start the server
    echo "********** Docker is not installed **********"
    
    # Change directory to the publisher directory
    # Check if redis is running and the start publisher
    if [ -x "$(command -v redis-cli)" ]
    then
        echo "********** Redis is running **********"
        echo "********** Starting publisher **********"
        cd server && REDIS_HOST=127.0.0.1 npm start
    else
        echo "********** Redis server is required but not found **********"
        echo "Bye... Come back when you have installed Redis server and started the subscriber (client dir) on port: 9000 🙄"
    fi
fi