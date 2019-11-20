#Docker Compose File

In order to use a local container instance of Docker, you'll need to check the folling list:

- Make sure that you have orsp-config folder at the root level of the orsp-pub project. 
This should have the three config files that the app needs. (application.yml, big-query.json and orsp-client.json)
- Complete that the docker-compose.yml is refering to the orsp-config  folder's path
- To create a new image in your local docker, run: 
  - `docker build -t orsp-pub-local --build-arg build_env=dev` 
  - Check if the image has been mounted properly using `docker images -a`, you should see a complete
  list of the images in your local, amongst them, there should be a orsp-pub-local image.
- After the image creation, we are set to run docker-compose.yml through: `docker-compose up`

This will initialize a local instance of docker running in a container, and accessible through `https://localhost:8080` 
by default.

**Note**:
Consider that if the docker’s instance host port :8080 is being used, 
you will get a connection error. Please make sure that this port is 
free or change it to use a different one.
 