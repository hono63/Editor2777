
from appdb import db
import uuid
import datetime

def json_serializer(model, instance):
    jdata = {}
    for k,v in model.__dict__.items():
            #print(jdata)
            if k in model.ColInt:
                jdata[k] = getattr(instance, k)
            elif k in model.ColStr:
                jdata[k] = getattr(instance, k)
    return jdata

class User(db.Model):
    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    ColInt = ("id")
    ColStr = ("name")
    def __repr__(self):
        return '<User %s>' % self.name
    def add_cb(self):
        pass
    def update_cb(self):
        pass

class Spec(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    guid       = db.Column(db.String)
    name       = db.Column(db.String)
    definition = db.Column(db.String)
    userid     = db.Column(db.Integer)
    #updated    = db.Column(db.String)
    ColInt = ("id", "userid")
    ColStr = ("name", "guid", "definition")
    def __repr__(self):
        return '<Spec %s>' % self.name
    def add_cb(self):
        #self.updated = datetime.datetime.strftime("%Y/%m/%d %H:%M")
        self.guid = str(uuid.uuid4())
    def update_cb(self):
        #self.updated = datetime.datetime.strftime("%Y/%m/%d %H:%M")
        if self.guid == "" or self.guid is None:
            self.guid = str(uuid.uuid4())

