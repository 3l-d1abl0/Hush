from flask import Flask

from src.controller.profile import profile
from src.controller.index import index
import os
import logging
from datetime import datetime
import time

app = Flask(__name__,
            static_url_path='',
            static_folder='src/static',
            template_folder='src/views')

# Setup Logger Config
logging.basicConfig(filename='logs/app.log', level=logging.INFO,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

# Setup app Configs
app.config.from_pyfile('./config/dev_env.cfg')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SALT'] = os.environ.get('SALT')

# Register the Bluprint Routes
app.register_blueprint(index, url_prefix='/')
app.register_blueprint(profile, url_prefix='/profile')

print(os.environ.get('SECRET_KEY'))
print(os.environ.get('SALT'))

if os.environ.get('AUTH_SERVER') != "":
    app.config['AUTH_SERVER'] = os.environ.get('AUTH_SERVER')

if os.environ.get('USER_SERVER') != "":
    app.config['USER_SERVER'] = os.environ.get('USER_SERVER')


@app.template_filter('formatDatetime')
def format_datetime(timestamp):
    timestamp = int(timestamp)
    datetime = time.strftime('%d-%m-%Y ',
                             time.localtime(timestamp))
    return (datetime)  # .strftime("%m/%d/%Y")


if __name__ == "__main__":

    app.logger.info('Info level log')
    app.logger.warning('Warning level log')

    port = int(os.environ.get("PORT", app.config['PORT']))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
