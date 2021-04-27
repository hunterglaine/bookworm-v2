import React, { useEffect } from "react";

import {
    useParams,
    useHistory,
  } from "react-router-dom";

import { 
    Row, 
    Col,
    Button
} from 'react-bootstrap';

import CategoryContainer from "./CategoryContainer"

function UserPage(props) {

    const { eventId } = useParams();
    const { type } = useParams();
    const userBookshelf = []
    let history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
    
    useEffect(() =>  {
        fetch("/user-data", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${props.userLoggedIn.accessToken}`
            },
        })
        .then (response => response.json())
        .then ((result) => Object.entries(result))
        .then((data) => props.setBookshelfCategories(data))
    }, [props.newLabel])

    let i = 0;
    for (const category of props.bookshelfCategories) {
        userBookshelf.push(<CategoryContainer 
                            key={i}
                            label={category[0]} 
                            books={category[1]} 
                            setBookForDetails={props.setBookForDetails}
                            setNewLabel={props.setNewLabel}
                            eventId={eventId}
                            type={type} />)
        i++;
    }

    return (
        <div>
            <Row className="m-0">
            <Col sm={1}></Col>
            <Col sm={8}>
            <h1 className="bookshelf-title">
                {props.userLoggedIn["userFirstName"]}'s Bookshelf
            </h1>
            </Col>
            <Col sm={3} >
            <Button className="button" onClick={() => history.push("/update-account-info")} >Update My Account Info</Button>
            </Col>
            </Row>
            <div>{userBookshelf}</div>
        </div>

        // Get a list of the user's categories
        // Ideally want a side bar with a list of all of the user's categories
    );
}

export default UserPage;