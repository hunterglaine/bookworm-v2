![Bookworm](/src/img/tiny_bookworm_logo.png "Bookworm")
Bookworm
======

Bookworm is single-page application book database that gives avid readers the ability to search for, store, and categorize books from the GoogleBooks API into a personal bookshelf. Users can create and attend book club events, where all attendees can suggest books from their shelves, read further information about each suggested book, and ultimately vote on the book to read. The current vote count for each book is displayed to all attendees, and when voting is stopped, the book with the most votes is the one that remains.

Check out the demo here: https://www.youtube.com/watch?v=4XsmJQI-Rao


<!-- Visit the live site here: http://www.bookworm-app.com/ -->

Table of Contents
------

[Tech Stack](#tech-stack)

[Features](#features)

[Installation](#installation)



Tech Stack
------

| <!-- -->    | <!-- -->    |
|:-------------|:-------------|
| **Backend**      | Python 3, SQLAlchemy, Flask |
| **Frontend**     | JavaScript, React, HTML5, CSS3, React-Bootstrap |
| **Database**     | PostgreSQL |
| **APIs**         | Google Books |
| <!-- -->    | <!-- -->    |



Features
------

<!-- + Create an account -->
### Login/Logout
![Login/Logout](/src/img/login-gif.gif)

### Search for books and add to your bookshelf
![Search and add books](/src/img/search-and-add-to-category.gif)

### Parouse bookshelf of saved books
![Parouse bookshelf](/src/img/parouse-bookshelf.gif)

### See all upcoming/past book clubs hosted and attended
![Upcoming and past events](/src/img/upcoming-and-past-events.gif)

### Suggest books for book clubs
![Suggest books](/src/img/suggest-book.gif)

### Vote for books
![Vote for books](/src/img/vote-for-books.gif)


Installation
------
In order to use Bookworm, you will first need:
+ Python 3.6.9
+ PostreSQL 10.15

To install Bookworm:

Clone this repository:

```$ git clone https://github.com/hunterglaine/bookworm-v2.git```

Create and activate a virtual environment:

Mac:

    $ virtualenv env
    $ source env/bin/activate

Windows:

    $ virtualenv env --always-copy
    $ source env/bin/activate

Install dependencies:

    (env) $ pip3 install -r requirements.txt

Create the database: 

    (env) $ python3 seed_database.py

Start the Flask server from the root directory:

    (env) $ python3 ./backend/api.py

In a separate terminal, start the React server:

    npm start

A window should open up at `http://localhost:3001/` so you can start curating your bookshelf and attending book clubs!


Contact
------
If you want to contact me, you can reach me at hunterglaine@gmail.com.

## Happy Reading! ????