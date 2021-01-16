# データベースの操作を行う

from models import User, Spec, json_serializer

class DBCtrl():
    def __init__(self, db):
        self.db = db
        #self.db.init_app(app)
        self.db.create_all()
        # sample
        #self.add(User, {"name": "Junsuke"})
        #self.add(Spec, {"name": "Hyoushi dake"})
    def get_json_list(self, model):
        datalist = []
        for instance in self.db.session.query(model):
            datalist.append(json_serializer(model, instance))
        return datalist
    def add(self, model, a_json):
        a_json2 = {}
        for k,v in a_json.items():
            if k in model.ColInt:
                a_json2[k] = int(v)
            elif k in model.ColStr:
                a_json2[k] = str(v)
        instance = model(**a_json2)
        self.db.session.add(instance)
        self.db.session.commit()

