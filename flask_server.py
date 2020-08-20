"""
Run Editor server by using Flask
"""

from npito import open_folder
from flask import Flask, render_template
app = Flask(__name__)
    

@app.route('/')
def hello():
    name = "Hello Flask!"
    return name

@app.route('/index', methods=["GET", "POST"])
def index():
    return render_template("index.html", name="namae")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=2777, debug=False)