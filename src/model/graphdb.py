from py2neo import Graph
import os

#url = os.environ.get("GRAPHENEDB_URL", "http://localhost:7474")

#graph = Graph(url+"/db/data/")

try:
    #graph = Graph('http://localhost:7474', username='neo4j', password='test')
    graph = Graph('"http://neo:7474"', username='neo4j', password='test')
except Exception as e:
    print("Failed to create the driver:", e)
