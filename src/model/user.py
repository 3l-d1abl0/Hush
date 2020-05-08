from py2neo import Graph, Node, Relationship, NodeMatcher
from flask import current_app
from .graphdb import graph
import bcrypt

class User:

    def __init__(self, username):
        self.username = username

    def find_by_username(self):
        matcher = NodeMatcher(graph)
        user = matcher.match("User").where("_.username =~ '{}'".format(self.username)).limit(1).first()
        print(user)
        return user

    def register_user(self, password):
        print(current_app.config['SALT'])
        #check if username exists
        if not self.find_by_username():
            user = Node("User", username=self.username, password=bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt(5)))
            graph.create(user)
            return True
        
        return False