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