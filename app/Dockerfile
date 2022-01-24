FROM python:3.9

#App Setup
COPY . /app
WORKDIR /app

EXPOSE 8888

# Requirements installation
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

ENTRYPOINT [ "python3", "app.py" ]
