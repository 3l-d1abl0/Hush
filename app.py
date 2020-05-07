from flask import Flask
#from flask_restful import Api


from src.controller.profile import profile

app = Flask(__name__, template_folder='src/views')

#Register the Bluprint Routes
app.register_blueprint(profile, url_prefix='/profile')

if __name__ == "__main__":
    app.run(port=8080, debug=True)