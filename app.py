from flask import Flask
#from flask_restful import Api


from src.controller.profile import profile
from src.controller.index import index

app = Flask(__name__,
            static_url_path='', 
            static_folder='src/static',
            template_folder='src/views')

#Register the Bluprint Routes
app.register_blueprint(index, url_prefix='/')
app.register_blueprint(profile, url_prefix='/profile')

if __name__ == "__main__":
    app.run(port=8080, debug=True)