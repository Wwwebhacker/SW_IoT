to build image
docker build -t my-mqtt-broker .
to start
docker run -d --name mqtt-broker -p 1883:1883 -p 15672:15672 my-mqtt-broker