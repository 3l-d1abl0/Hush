from flask import Flask
from config import DevelopmentConfig
from src.model.graphdb import graph

from src.controller.profile import profile
from src.controller.index import index
import os
app = Flask(__name__,
            static_url_path='',
            static_folder='src/static',
            template_folder='src/views')

# Setup app Configs
app.config.from_pyfile('./config/product_env.cfg')

# Register the Bluprint Routes
app.register_blueprint(index, url_prefix='/')
app.register_blueprint(profile, url_prefix='/profile')


def db_init():
    print('Creating Constraints ...')
    try:
        # .evaluate()
        graph.run("CREATE CONSTRAINT ON (n:User) ASSERT n.username IS UNIQUE")
        graph.run("CREATE CONSTRAINT ON (n:Post) ASSERT n.id IS UNIQUE")
        graph.run("CREATE CONSTRAINT ON (n:Tag) ASSERT n.name IS UNIQUE")
        graph.run("CREATE INDEX ON :Post(date)")
    except Exception as e:
        print("Error while creating Constraints !")
        print(e)


if __name__ == "__main__":
    db_init()
    port = int(os.environ.get("PORT", app.config['PORT']))
    app.run(port=port, debug=app.config['DEBUG'])
