from flask import Flask
from config import DevelopmentConfig
from src.model.graphdb import graph

from src.controller.profile import profile
from src.controller.index import index

app = Flask(__name__,
            static_url_path='', 
            static_folder='src/static',
            template_folder='src/views')

#Setup app Configs
app.config.from_pyfile('./config/dev_env.cfg')

#Register the Bluprint Routes
app.register_blueprint(index, url_prefix='/')
app.register_blueprint(profile, url_prefix='/profile')

'''
print(app.config)
print(f"Environment: {app.config['ENV']}")
print(f"Debug: {app.config['DEBUG']}")
print(f"Secret key: {app.config['SECRET_KEY']}")
print(app.config['PORT'])
'''

def db_init():
    print('Creating Constraints ...')
    #graph.run("CREATE CONSTRAINT ON (n:User) ASSERT n.username IS UNIQUE") #.evaluate()
    #graph.run("CREATE CONSTRAINT ON (n:Post) ASSERT n.id IS UNIQUE")
    #graph.run("CREATE CONSTRAINT ON (n:Tag) ASSERT n.name IS UNIQUE")
    #graph.run("CREATE INDEX ON :Post(date)")

if __name__ == "__main__":
    db_init()
    app.run(port=app.config['PORT'], debug=app.config['DEBUG'])