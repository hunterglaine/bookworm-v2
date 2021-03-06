from flask import Flask, render_template, request, flash, session, redirect, jsonify, json
from flask_cors import CORS
from model import connect_to_db, db
import crud
from datetime import date

app = Flask(__name__)
app.secret_key = "hgJGF#^t7834yhagT&#*ggsdyuyye8q4uirhe8yhGgjhjkhy472ywulg;kjp'l37"
CORS(app)


@app.route("/users", methods=["GET","POST"])
def create_or_get_user():
    """Create a new user or get info about existing user."""

    if request.method == "GET":
        if session.get("user_id"):
            user_id = session["user_id"]
            user = crud.get_user_by_id(user_id)
            user = user.to_dict()
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
        return jsonify ({"user": user.to_dict()})


@app.route("/login", methods=["POST"])
def log_in_user():
    """Log a user in and show them they were successful or not."""
    
    email = request.json.get("email")
    password = request.json.get("password")

    user = crud.get_user_by_email(email.lower())

    if user:
            if user.check_password(password):
                session["user_id"] = user.id
                return jsonify ({"success": "Successfully logged in!",
                                "user_id": user.id,
                                "user_first_name": user.first_name})
            else:
                return jsonify ({"error": "Incorrect password. Please try again or create a new account."})
    else:
        return jsonify ({"error": "Sorry, but no account exists with that email."})


@app.route("/logout", methods=["POST"])
def log_out_user():
    """Log a user out and show them they were successful or not."""
    print("This is the session before popping", session)
    user_id = session.pop("user_id")
    print("This is the popped user id", user_id)
    user = crud.get_user_by_id(user_id)

    return jsonify ({"success": f"{user.first_name}, you have been successfully logged out! Come back soon, and happy reading!"})

@app.route("/categories", methods=["GET", "POST", "PUT", "DELETE"])
def get_and_update_categories():
    """Gets or updates a user's categories"""

    if session.get("user_id"):
        user_id = session["user_id"]

        if request.method == "GET":
            # get and return all of the user's categories
            categories = []

            category_objects = crud.get_all_user_categories(session["user_id"])

            for category_object in category_objects:
                dict_category = category_object.to_dict()
                categories.append(dict_category)

            return jsonify({"categories": categories})

        elif request.method == "POST":
            if request.json.get("label"):
                # if "label" is sent with the request, ccreate a new category
                label = request.json.get("label")
                user = crud.get_user_by_id(user_id)
            
                if crud.get_category_by_label(user_id, label):
                    return ({"error": f"{label} is already in {user.first_name}'s bookshelf!"})

                new_category = crud.create_category(user_id, label)

                return jsonify ({"success": f"{new_category.label} has been added to {user.first_name}'s bookshelf!"})

            else:
                # Otherwise, if "old_label" and "new_label" are sent, update 
                # category label
                old_label = request.json.get("old_label")
                new_label = request.json.get("new_label")

                crud.update_category_label(user_id, old_label, new_label)

                return jsonify({"success": f"{old_label} has been changed to {new_label}!",
                                "label": new_label})

        elif request.method == "PUT":
            # If book or category doesn't exist, create it and add book to category 
            label = request.json.get("label")
            book_dict = request.json.get("book")
            isbn = book_dict["id"]
            book = crud.get_book_by_isbn(isbn)
            category = crud.get_category_by_label(user_id, label)
        
            if not book:
                authors = ""
                for author in book_dict["volumeInfo"]["authors"]:
                    authors += f"{author} "
                page_count = book_dict["volumeInfo"].get("pageCount")
                if not page_count:
                    page_count = 000
                book = crud.create_book(isbn, 
                                        book_dict["volumeInfo"]["title"], 
                                        authors,
                                        book_dict["volumeInfo"]["description"], 
                                        page_count, 
                                        book_dict["volumeInfo"]["imageLinks"]["thumbnail"])

            if not category:
                category = crud.create_category(user_id, label)

                added_books = crud.create_book_category(book, category)
                return jsonify ({"success": f"""A new category, {category.label}, has been added to your bookshelf and {book.title} has been added to it"""})

            if book in crud.get_all_books_in_category(user_id, label):
                return jsonify ({"error": f"{book.title} is already in your {category.label} books"})

            added_books = crud.create_book_category(book, category)
            # Right now, added_books is a list of all of the book objects in category
        
            return jsonify ({"success": f"{book.title} has been added to {category.label} books"})
            # 'books_in_category': added_books

        elif request.method == "DELETE":
            # Removed category from user's categories
            if request.json.get("label"):
                label = request.json.get("label")
                crud.delete_category(label, user_id)

                return jsonify ({"success": f"{label} has successfully been removed from your bookshelf.",
                                "label": ""})

            else: 
                label = request.json.get("category")
                isbn = request.json.get("isbn")
                title = request.json.get("title")

                this_category = crud.get_category_by_label(user_id, label)

                crud.remove_book_from_category(isbn, this_category.id)

                return jsonify ({"success": f"{title} has successfully been removed from {label}.",})


@app.route("/user-data", methods=["GET", "POST"])
def get_user_data():
    """Updates or retrieves user account information"""

    if session.get("user_id"):
        user_id = session["user_id"]

        if request.method == "POST":
            # Updates user account information 
            new_first_name = request.json.get("newFirstName")
            new_last_name = request.json.get("newLastName")
            new_email = request.json.get("newEmail")
            new_city = request.json.get("newCity")
            new_state = request.json.get("newState")
            old_password = request.json.get("oldPassword")
            new_password = request.json.get("newPassword")

            crud.update_user_account(user_id, new_first_name, new_last_name, 
                                    new_email, new_city, new_state, 
                                    old_password, new_password)

            return jsonify ({"success": "Your account has successfully been updated"})

        if request.method == "GET":
            # Returns user's categories and books within them
            category_labels = crud.get_all_user_category_labels(user_id)
            # A list of the user's category names

            category_dict = {}
            book_list = []
            for category in category_labels:
                books = crud.get_all_books_in_category(user_id, category)
                for book in books:
                    book_list.append(book.to_dict())
                
                category_dict[category] = book_list
                book_list = []

            return jsonify (category_dict)

    else:
        return jsonify ({'error': 'User must be logged in to view this page.'})


#### EVENT ROUTES ####
@app.route("/user-events", methods=["GET", "POST", "PUT", "DELETE"])
def get_create_user_events():
    """Creates, adds, removes, or returns user's events, hosting and attending"""


    if request.method == "POST":
        if session.get("user_id"):
            host_id = session["user_id"]
            city = request.json.get("city")
            state = request.json.get("state")
            eventDate = request.json.get("eventDate")
            startTime = request.json.get("startTime")
            endTime = request.json.get("endTime")

            new_event = crud.create_event(host_id, city, eventDate, startTime, endTime, state)
            # Add host as an attendee of the event
            crud.create_event_attendee(host_id, new_event.id)

            return jsonify ({"success": f"Your event has successfully been created for {eventDate} at {startTime}"})

        else:
            return jsonify ({"error": "There was an error creating this event."})


    elif request.method == "GET":
        if session.get("user_id"):
            user_id = session["user_id"]
            users_events = crud.get_all_events_for_user(user_id)
            # A list of the user's event objects
            
            if users_events:
                users_events_dict = {"hosting": {"past": [], "upcoming": []}, 
                                    "attending": {"past": [], "upcoming": []}}

                for event in users_events:
                    events_books = crud.get_all_events_books(event.id)
                    events_books = [event_book.to_dict() for event_book in events_books]
                    books = crud.get_all_books_for_event(event.id) # CHANGED
                    books = [book.to_dict() for book in books]

                    host = crud.get_user_by_id(event.host_id)

                    event = event.to_dict()
                    event["books"] = books
                    event["events_books"] = events_books
                    event["host"] = f"{host.first_name} {host.last_name}"

                    today = date.today()
                    if event["host_id"] == user_id:
                        if today <= event["event_date"]:
                            users_events_dict["hosting"]["upcoming"].append(event)
                        else: 
                            users_events_dict["hosting"]["past"].append(event)

                        # users_events_dict["hosting"].append(event)
                    else:
                        if today <= event["event_date"]:
                            users_events_dict["attending"]["upcoming"].append(event)
                        else: 
                            users_events_dict["attending"]["past"].append(event)

                        # users_events_dict["attending"].append(event)
                
                if len(users_events_dict["hosting"]["upcoming"]) == 0:
                    users_events_dict["hosting"]["upcoming"] = None
                if len(users_events_dict["hosting"]["past"]) == 0:
                    users_events_dict["hosting"]["past"] = None

                # if len(users_events_dict["hosting"]) == 0:
                #     users_events_dict["hosting"] = None

                elif len(users_events_dict["attending"]["upcoming"]) == 0:
                    users_events_dict["attending"]["upcoming"] = None
                elif len(users_events_dict["attending"]["past"]) == 0:
                    users_events_dict["attending"]["past"] = None

                # elif len(users_events_dict["attending"]) == 0:
                #     users_events_dict["attending"] = None

                return jsonify (users_events_dict)

            else:
                return jsonify ({"hosting": {"past": None, "upcoming": None}, 
                                "attending": {"past": None, "upcoming": None}})

        else:
            return jsonify ({'error': 'User must be logged in to view their events.'})


    user_id = session.get("user_id")
    event_id = request.json.get("event")
    event = crud.get_event_by_id(event_id)
    user = crud.get_user_by_id(user_id)
    attendees = crud.get_all_attendees(event_id)

    if request.method == "DELETE":
        if user not in attendees:
            return jsonify({"error": "You are not attending this event"})
        
        crud.remove_attendee_from_event(user_id, event_id)

        return jsonify ({"success": f"You are no longer attending the {event.city} book club on {event.event_date}"})

    elif request.method == "PUT":
        
        if user in attendees:
            return jsonify({"error": "You are already attending this event"})

        crud.create_event_attendee(user_id, event_id)

        return jsonify ({"success": f"You are now attending the {event.city} book club on {event.event_date}!"})


@app.route("/event-books", methods=["POST", "PUT"])
def update_event_books():
    """Updates the status of can_suggest_books and can_vote on an event"""

    if request.method == "POST":
        if session.get("user_id"):
            event_id = request.json.get("event_id")
            update_type = request.json.get("update_type")

            if update_type == "suggest":
                crud.update_event_suggesting(event_id)
            
                return jsonify({"success": "Event books has been updated"})
            
            if update_type == "vote":
                crud.update_voting(event_id)
                event = crud.get_event_by_id(event_id)
            if not event.can_vote:
                events_books = crud.get_all_events_books(event_id)
                vote_totals_dict = {}

                for event_book in events_books:
                    vote_totals_dict[event_book.vote_count] =  vote_totals_dict.get(event_book.vote_count, [])
                    vote_totals_dict[event_book.vote_count].append(event_book.isbn)

                max_votes = set(vote_totals_dict[max(vote_totals_dict)])

                for event_book in events_books:
                    if event_book.isbn not in max_votes:
                        crud.remove_book_from_event(event_book.isbn, event_id)
                    else:
                        crud.reset_vote_count(event_book)

                attendees = crud.get_all_events_attendees(event_id)
                print("attendees", attendees)
                for attendee in attendees:
                    crud.reset_voted_for(attendee)
                

            return jsonify({"success": "Voting has been updated"})

    if request.method == "PUT":
        event_id = request.json.get("event_id")
        isbn = request.json.get("isbn")

        event = crud.get_event_by_id(event_id)
        book = crud.get_book_by_isbn(isbn)

        if book not in crud.get_all_books_for_event(event_id):
            crud.create_event_book(event, book)

            return jsonify({"success": f"You have suggested {book.title}"})
        
        else:
            return jsonify({"error": f"That book has already been suggested for the event."})


@app.route("/vote", methods=["GET", "POST"])
def update_event_book_votes():
    """Increases or returns the number of votes on a given event book"""
    user_id = session.get("user_id")

    events = crud.get_all_events_for_user(user_id)
    all_events = {}
    for event in events:
        events_books = crud.get_all_events_books(event.id)
        event_dict = event.to_dict()
        events_books = [event_book.to_dict() for event_book in events_books]
        event_dict["events_books"] = events_books
        all_events[event.id] = event_dict

    if request.method == "GET":
        # get all of the user's event_books
        events_attendee_dict = crud.get_all_users_voted_for_books(user_id)
        # dictionary with event_id as key and list of book isbn's that the given
        # user has voted for (if any) for each event
        
        return jsonify({"booksVotedFor": events_attendee_dict,
                        "allEventsBooks": all_events})

    else:
        event_id = request.json.get("eventId")
        isbn = request.json.get("bookIsbn")

        event_attendee = crud.get_event_attendee_by_id(user_id, event_id)
    
        update = event_attendee.update_voted_for(isbn) # returns, "removed", "added", or None
        events_attendee_dict = crud.get_all_users_voted_for_books(user_id)
       
        # events_books = crud.get_all_events_books(event_id)
        # events_books = [event_book.to_dict() for event_book in events_books]


        if not update:
            # But buttons to vote should already be gone
            return jsonify({"error": "You have already voted twice.",
                            "booksVotedFor": events_attendee_dict,
                            "allEventsBooks": all_events})
        
        event_book = crud.get_event_book_by_isbn(event_id, isbn)
        book = crud.get_book_by_isbn(isbn)

        if update == "removed":
            crud.update_event_book_vote_count(event_book, "remove")
            return jsonify({"success": f"You have successfully 'unvoted' for {book.title}.",
                            "booksVotedFor": events_attendee_dict,
                            "allEventsBooks": all_events})
           
        crud.update_event_book_vote_count(event_book, "add")
        
        if len(events_attendee_dict[event_id]) >= 2:
            # Vote buttons on the front end should disappear (but unvote buttons should remain)
            return jsonify({"success": f"You voted for {book.title}",
                            "booksVotedFor": events_attendee_dict,
                            "buttons": "hidden",
                            "allEventsBooks": all_events})
        
        return jsonify({"success": f"You voted for {book.title}",
                        "booksVotedFor": events_attendee_dict,
                        "buttons": "visible",
                        "allEventsBooks": all_events})
    

@app.route("/events", methods=["GET", "DELETE"]) 
def get_all_events():
    """Returns all events that are not private"""

    if request.method == "GET":
        events = crud.get_all_events()
        today = date.today()

        all_events = {"past": [], "upcoming": []}

        for event in events:
            event = event.to_dict()
            host = crud.get_user_by_id(event["host_id"]).to_dict()
            attendee_users = crud.get_all_attendees(event["id"])
            attendees = [attendee.to_dict() for attendee in attendee_users if attendee.id != host["id"]]
            
            event["attending"] = attendees
            event["host"] = host
            if today <= event["event_date"]:
                all_events["upcoming"].append(event)
            else: 
                all_events["past"].append(event)
            
        return jsonify (all_events)
    
    if request.method == "DELETE":
        event_id = request.json.get("event_id")
        crud.delete_event(event_id)

        return jsonify ({"success": f"Your event has been successfully deleted."})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)


    