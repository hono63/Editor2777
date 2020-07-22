
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello():
    name = "Hello Flask!!"
    return name

@app.route('/index', methods=["GET", "POST"])
def index():
    return render_template("index.html", name="namae")

if __name__ == "__main__":
    app.run(debug=True)