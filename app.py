from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/sokoban")
def sokoban():
    return render_template("sokoban.html")


@app.route("/wumpus")
def wumpus():
    return render_template("wumpus.html")


if __name__ == "__main__":
    app.run(debug=True)
