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
        user = matcher.match("User").where(
            "_.username =~ '{}'".format(self.username)).limit(1).first()
        print(user)
        return user

    def register_user(self, password):
        print(current_app.config['SALT'])
        # check if username exists
        if not self.find_by_username():
            user = Node("User", username=self.username, password=bcrypt.hashpw(password.encode('utf8'),
                                                                               bcrypt.gensalt(5)).decode('utf8'))
            # try:
            graph.create(user)
            # except Exception as e:
            #    print("Error ", e)
            return True

        return False

    def verify_password(self, password):

        user = self.find_by_username()

        if not user:
            return False

        print(user["password"].encode('utf8'))
        print(password.encode('utf8'))
        return bcrypt.checkpw(password.encode('utf8'), user["password"].encode('utf8'))

    def add_post(self, post_text, tags):

        user = self.find_by_username()

        if not user:
            return False

        # Create Post
        post = Node("Post", id=str(uuid.uuid4()), text=post_text, timestamp=int(
            datetime.now().strftime("%s")), date=datetime.now().strftime("%F"))
        rel = Relationship(user, "PUBLISHED", post)
        graph.create(rel)

        for tag in tags:
            tg = Node("Tag", name=tag)
            graph.merge(tg, "Tag", "name")
            rel = Relationship(tg, "TAGGED", post)
            graph.create(rel)

        return True

    def get_recent_post(self):

        if not self.find_by_username():
            return False

        # Recent Post by other Users
        query = "MATCH (user:User)-[:PUBLISHED]->(post:Post) WHERE user.username <>'%s' RETURN user.username AS username, post ORDER BY post.timestamp DESC LIMIT 10" % (self.username)

        # Recent post by user
        #query = "MATCH (user:User {username: '%s' })-[:PUBLISHED]->(post:Post) RETURN post,user.username AS username ORDER BY post.timestamp DESC LIMIT 10"%(self.username)

        # Recent Post by everyone
        #query = "MATCH (user:User)-[:PUBLISHED]->(post:Post) RETURN post,user.username AS username ORDER BY post.timestamp DESC LIMIT 10"

        return graph.run(query)

    def get_user_post(self):

        if not self.find_by_username():
            return False

        query = "MATCH (user:User {username: '%s' })-[:PUBLISHED]->(post:Post) RETURN post,user.username AS username ORDER BY post.timestamp DESC LIMIT 10" % (
            self.username)

        return graph.run(query)
