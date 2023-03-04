# Hush

Hush is a min social media platform with minimal features.

I created this just for fun and to implement my Kubernetes Learning.

## Deploying

#### 1. Localhost

Clone this repo.

 ##### A. Redis Setup:

	Set up you Redis to run on port 6739 (default)

 #####  B. Neo4j Setup:
  
	Setup you Neo4j Databse to accept connection on port 7687 (default)

[Neo4j Installation Instruction](https://neo4j.com/docs/desktop-manual/current/installation/download-installation/  "Installation Instruction")

 #####  C. User Service Setup:
```
cd hush/user-service/
npm install
npm start
```
 ##### D. Auth Service Setup:
```
cd hush/auth-service
npm install
npm start
```
 
 ##### E. Flask App Setup
```
cd hush/app
pip3 install -r requirement.txt
python3 app.py
```
Visit localhost:8888

 *Please look at sampledoenv file in each service and rename it to .env with the configs*


#### 2. Using Docker

Create a docker network if all services are meant tp run on the same host.

```
docker network create hush-network
```

 ##### A. Redis Setup:
```
	docker run --name hush-redis-service-v1 -v /opt/redis-data:/data -p 6379:6379 -d redis:6.0
	docker network connect hush-network hush-redis-service-v1
```

 #####  B. Neo4j Setup:
  
```
	docker run \
	--name hush-neo4j-service-v1 \
    -p7474:7474 -p7687:7687 \
    -d \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/var/lib/neo4j/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/test \
    neo4j:4.4

	docker network connect hush-network hush-neo4j-service-v1
```
 #####  C. User Service Setup:
```
    docker build -t <tag> .
    docker run --name hush-user-service-v1 -d --env-file ./.env -p 8000:8000 <tag>
    docker network connect hush-network hush-user-service-v1
```
 ##### D. Auth Service Setup:
```
    docker build -t <tag> .
    docker run --name hush-auth-service-v1 -d --env-file ./.env -p 9090:9090 <tag>
    docker network connect hush-network hush-auth-service-v1
```
 
 ##### E. Flask App Setup
```
    docker build -t <tag> .
    docker run --name hush-web-app-v1 -d --env-file ./.env -p 8888:8888 <tag>
    docker network connect hush-network hush-web-app-v1
```
Visit port 8888