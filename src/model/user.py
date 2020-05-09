from py2neo import Graph, Node, Relationship, NodeMatcher
from datetime import datetime
from flask import current_app
from .graphdb import graph
import bcrypt
import uuid

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

    def verify_password(self, password):

        user = self.find_by_username()

        if not user:
            return False

        return bcrypt.checkpw(password.encode('utf8'), user["password"])


    def add_post(self, post_text):

        user = self.find_by_username()

        if not user:
            return False

        post = Node("Post", id=str(uuid.uuid4()), text=post_text, timestamp= int(datetime.now().strftime("%s")), date= datetime.now().strftime("%F"))

        rel = Relationship(user, "PUBLISHED", post)
        graph.create(rel)

        return True


    def get_recent_post(self):

        if not self.find_by_username():
            return False
        #Recent post by user
        #query = "MATCH (user:User {username: '%s' })-[:PUBLISHED]->(post:Post) RETURN post,user.username AS username ORDER BY post.timestamp DESC LIMIT 10"%(self.username)

        #Recent Post by everyone
        query = "MATCH (user:User)-[:PUBLISHED]->(post:Post) RETURN post,user.username AS username ORDER BY post.timestamp DESC LIMIT 10"
        '''
        query = """
        MATCH (u:User {username: {username} })-[:PUBLISHED]->(p:Post) RETURN p ORDER BY p.timestamp DESC LIMIT 10;
        """
        '''

        return graph.run(query)
