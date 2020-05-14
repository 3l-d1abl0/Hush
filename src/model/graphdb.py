from py2neo import Graph

url = os.environ.get("GRAPHENEDB_URL", "http://localhost:7474")

graph = Graph(url+"/db/data/")