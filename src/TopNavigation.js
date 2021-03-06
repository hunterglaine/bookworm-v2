import React from 'react';
import { Link } from "react-router-dom";
import { 
    Navbar, 
    Nav
} from 'react-bootstrap';

import bookworm_logo2 from "./img/bookworm_logo2.png"
import SearchBar from "./SearchBar"


// Create and display the navigation bar at the top of the page - logo, search bar, create account button, and log in butto
function TopNavigation(props) {

  return (

    <Navbar variant="dark" className="color-nav d-flex justify-content-start" sticky="top" >
          <Navbar.Brand className="p-2"> 
            <Link to={props.userLoggedIn.userId ? "/user/home/browsing" : "/login"}>
              <img id="logo" src={bookworm_logo2} alt="Bookworm"/>
            </Link>
          </Navbar.Brand>
            <SearchBar 
              bookQuery={props.bookQuery} 
              setBookQuery={props.setBookQuery} 
              userCategories={props.userCategories} 
              setUserCategories={props.setUserCategories} 
            />
          
          <Nav as="ul" className="ml-auto p-2">
            <Nav.Item as="li">
              {props.userLoggedIn.userId 
                ? <Link className="link-button" to="/users-events">My Events</Link>
                : null}
            </Nav.Item>
            <Nav.Item as="li">
              <Link className="link-button" to="/all-events">
                All Bookworm Events
              </Link>
            </Nav.Item>
            <Nav.Item as="li" >
              <Link className="link-button" to={props.userLoggedIn.userId ? "/user/home/browsing" : "/create-account"}>
                {props.userLoggedIn.userId ? "My Bookshelf" : "Create Account"}
              </Link>
            </Nav.Item>
            <Nav.Item as="li" >
              <Link className="link-button" to={props.userLoggedIn.userId ? "/logout" : "/login"}>
                {props.userLoggedIn.userId ? "Log Out" : "Log In"}
              </Link>
            </Nav.Item>
          </Nav>
        </Navbar>
  );
};

export default TopNavigation;

