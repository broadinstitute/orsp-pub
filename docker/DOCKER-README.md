#Docker Compose File

In order to use a local container instance of Docker, you'll need to check the following list:

- Make sure that you have orsp-config folder at the root level of the orsp-pub project. 
This should have the three config files that the app needs. (application.yml, big-query.json and orsp-client.json)
- Ensure that the docker-compose.yml is referring to the orsp-config folder's path
- To create a new image in your local docker, run: 
  - `docker build -t orsp-pub-local --build-arg build_env=dev` 
  - Check if the image has been mounted properly using `docker images -a`, you should see a complete
  list of the images in your local, amongst them, there should be a orsp-pub-local image.
- After the image creation, we are set to run docker-compose.yml through: `docker-compose up`
  docker-compose.yml file will contain a commented code section, this is used only if you need to run a local database 
  instance. 

#Local Database Instance
In this case you need to make the next changes: 
- Go to the project's cloud console, find the current dev db that we have in SQL
- Click Export
- Store it in the designated bucket to store sql copies
- Choose an export name that makes sense, i.e Cloud_SQL_Export_2019-07-29.sql
- Export as sql
- Download from the bucket and put into the orsp-config directory.
- Uncoment `docker-compose.yml` proxy-sql section changing username/password from consent.yaml and the name of the 
  sql database file created and stored in orsp-config.
   
This will initialize a local instance of docker running in a container, and accessible through `https://localhost:8080` 
by default.

For further information about database please check this document:
https://docs.google.com/document/d/1WpAmG_mnajChvRmReMr0u_uxXwk1LRHO70sBzqHOfAk

**Note**:
Consider that if the docker’s instance host port :8080 is being used, you will get a connection error. 
Please make sure that this port is free or change it to use a different one.
 