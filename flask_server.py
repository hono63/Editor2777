"""
Run Editor server by using Flask
"""

#from npito import open_folder
from flask import Flask, render_template, redirect
from appdb import app, db
from dbctrl import DBCtrl
from models import User, Spec

dbc = DBCtrl(db)

@app.route('/')
def route():
    #return redirect("index")
    return "<h1>hello</h1>"

@app.route('/index', methods=["GET", "POST"])
def index():
    userslist = dbc.get_json_list(User)
    specslist = dbc.get_json_list(Spec)
    #print(userslist)
    return render_template("index.html", users=userslist, specs=specslist)

@app.route('/update-data', methods=["POST"])
def update_data():
    if request.form:
    userslist = dbc.get_json_list(User)
    specslist = dbc.get_json_list(Spec)
    #print(userslist)
    return render_template("index.html", users=userslist, specs=specslist)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=2777, debug=True)

