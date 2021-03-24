from flask import Flask, render_template, request, flash, session, redirect, jsonify, json
from flask_cors import CORS
# from model import connect_to_db, db
# import crud
from datetime import date

app = Flask(__name__)
app.secret_key = "hgJGF#^t7834yhagT&#*ggsdyuyye8q4uirhe8yhGgjhjkhy472ywulg;kjp'l37"
CORS(app)

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route("/users", methods=["GET","POST"])
def create_new_user():
    """Create a new user or get info about existing user."""

    if request.method == "GET":
        if session.get("user"):
            user_id = session["user"]
            user = crud.get_user_by_id(user_id)
            user = user.to_dict()
            print("USERUSERUSER", user)
            return jsonify (user)

    if request.method == "POST":
        first_name = request.json.get("first_name")
        last_name = request.json.get("last_name")
        email = request.json.get("email")
        password = request.json.get("password")
        city = request.json.get("city")
        state = request.json.get("state")

        if crud.get_user_by_email(email):
            return jsonify ({"error": f"An account with the email, {email}, already exists."})
            
        user = crud.create_user(first_name, last_name, email, password, city, state)
        first_category = crud.create_category(user.id, "My Favorite Books")
        # return jsonify ({'status': '200',
        #                 'message': 'Account has successfully been created'})
        return jsonify ({"user": user.to_dict()})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)