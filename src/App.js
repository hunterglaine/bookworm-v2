import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import TopNavigation from "./TopNavigation"
import UserEvents from "./UserEvents"
import LogIn from "./LogIn"
import LogOut from "./LogOut"
import CreateAccount from "./CreateAccount"
import UserPage from "./UserPage"
import SearchResults from "./SearchResults"
import BookDetails from "./BookDetails"
import AllEvents from "./AllEvents"
import UpdateAccount from "./UpdateAccount"
import CreateEvent from "./CreateEvent"

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';


function App() {

  const [userLoggedIn, setUserLoggedIn] = useState({userId: null, userFirstName: null});

  const [bookQuery, setBookQuery] = useState(null);
  const [userCategories, setUserCategories] = useState();
  const [bookshelfCategories, setBookshelfCategories] = useState([]);
  const [bookForDetails, setBookForDetails] = useState({});
  const [newLabel, setNewLabel] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== "null") {
      setUserLoggedIn({userId: localStorage.getItem("userId"), userFirstName: localStorage.getItem("userFirstName"), accessToken: localStorage.getItem("accessToken")})
  }
  window.scrollTo(0, 0)
  }, [])

    return (
        <Router>
          <div>
            <TopNavigation
              bookQuery={bookQuery} 
              setBookQuery={setBookQuery} 
              userCategories={userCategories} 
              setUserCategories={setUserCategories}
              userLoggedIn={userLoggedIn} 
            />
            <Switch>
            <Route exact path="/">
              {userLoggedIn.userId 
              ? <UserEvents 
                  userLoggedIn={userLoggedIn}
                  setBookForDetails={setBookForDetails} />
                  // setEventForDetails={setEventForDetails} />
              : <LogIn userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />}
            </Route>
            
              <Route path="/login">
                <LogIn userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
              </Route>
              <Route path="/login">
                <LogIn userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
              </Route>
              <Route path="/logout">
                <LogOut userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
              </Route>
              <Route path="/create-account">
                <CreateAccount />
              </Route>
              <Route exact path="/user/:eventId/:type">
                <UserPage 
                  userLoggedIn={userLoggedIn}
                  userCategories={userCategories}
                  setBookshelfCategories={setBookshelfCategories}
                  bookshelfCategories={bookshelfCategories}
                  setBookForDetails={setBookForDetails}
                  newLabel={newLabel}
                  setNewLabel={setNewLabel}
                />
              </Route>
              <Route exact path="/update-account-info">
                <UpdateAccount 
                  userLoggedIn={userLoggedIn}
                />
              </Route>
              <Route path="/book-search/:urlQuery">
                <SearchResults 
                  bookQuery={bookQuery} 
                  userLoggedIn={userLoggedIn} 
                  userCategories={userCategories}
                  setUserCategories={setUserCategories} 
                />
              </Route>
              <Route exact path="/book-details/:categoryLabel/:eventId" >
                <BookDetails bookForDetails={bookForDetails} />
              </Route>
              <Route path="/create-event" >
                <CreateEvent userLoggedIn={userLoggedIn} />
              </Route>
              <Route path="/users-events" >
                <UserEvents 
                  userLoggedIn={userLoggedIn}
                  setBookForDetails={setBookForDetails} 
                />
              </Route>
              <Route path="/all-events" >
                <AllEvents userLoggedIn={userLoggedIn} />
              </Route>
            {/* <footer className="color-nav">
              <div style={{display: "block", padding: "0", height: "1rem", width: "100%"}}></div>
              <div style={{ textAlign: "center", padding: "1rem", left: "0", bottom: "1rem", height: "4rem", width: "100%", fontWeight: "bold"}}>
                “A reader lives a thousand lives before he dies . . . The man who never reads lives only one.” – George R.R. Martin
              </div>
            </footer> */}
            </Switch>
        </div>
    </Router>
    );
}

export default App;
