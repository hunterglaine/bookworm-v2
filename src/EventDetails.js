import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { 
    Card,
    Button 
} from "react-bootstrap";
import Book from "./Book"


function EventDetails(props) {
    
    const {event} = props
    const [booksVotedFor, setBooksVotedFor] = useState([])
    const [eventsBooksVotes, setEventsBooksVotes] = useState([])
  
    let history = useHistory();

    useEffect(() => {
        fetch("/vote", {
            method: "GET"
        })
        .then((response) => response.json())
        .then((data) => {
            setBooksVotedFor(data["booksVotedFor"])
            setEventsBooksVotes(data["allEventsBooks"])
        })
    }, [props.changeInEvent])
    
    const updateEventBooks = (eventId, type) => (evt) => {
        evt.preventDefault();

        fetch("/event-books", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({"event_id": eventId,
                                "update_type": type}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => props.setChangeInEvent(data["success"]))
        .then(() => props.setChangeInEvent(null))
    }

    const updateVote = (bookIsbn) => (evt) => {
        evt.preventDefault();
        console.log("this ran")
        
        fetch("/vote", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({"eventId": event.id,
                                "bookIsbn": bookIsbn}),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(result => {
            setBooksVotedFor(result["booksVotedFor"]);
            return result;
        })
        .then(data => {
            if ("error" in data) {
                alert(data["error"])
            }
            else {
                // alert(data["success"])
                setEventsBooksVotes(data["allEventsBooks"])
        
                props.setChangeInEvent(data)
                props.setChangeInEvent(null)
            }
        })
    }

    const unAttend = (evt) => {
        evt.preventDefault();

        fetch("/user-events", {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({"event": event.id}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if ("error" in data) {
                alert(data["error"])
            }
            else {
                props.setChangeInEvent(data)
                props.setChangeInEvent(null)
                // alert(data["success"])
            }
        })
    } 

    const deleteEvent = (eventId) => (evt) => {
        evt.preventDefault();
        console.log("Well, that's something...")

        fetch("/events", {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({"event_id": eventId}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
                props.setChangeInEvent(data)
                props.setChangeInEvent(null)
            })
        }


    return (
        (<Card className="card-color">
            <h3>Book Club On {event.event_date.slice(0,16)}!</h3>
            {props.type === "hosting" ? null : <p><strong>Hosted by:</strong> {event.host}</p>}
            <p><strong>Time:</strong> {event.start_time} to {event.end_time}</p>
            <p><strong>Location:</strong> {event.city}</p>
            {event.books === [] 
            ? null 
            : <div className="book-tile">
                {event.books.length === 1 ? <h4>We're Reading</h4> : <h4>Book Suggestions</h4>}
                {event.books.map((book, idx) => 
                    (<div key={idx} className="event-book">
                        <Card className="text-center card-color" border="light">
                            <Book key={book.isbn} book={book} setBookForDetails={props.setBookForDetails} categoryLabel="event" eventId={event.id} />
                            {event.can_vote 
                                ? <div>
                                    {eventsBooksVotes[event.id]
                                    ? (eventsBooksVotes[event.id].events_books.map((eventBook, idx) =>
                                        <div key={idx}>
                                            {eventBook.isbn === book.isbn ? eventBook.vote_count : null}
                                        </div>))
                                    : null
                                    }
                                    <Button className="button" id={book.isbn} onClick={updateVote(book.isbn)}>
                                        {booksVotedFor[event.id] && booksVotedFor[event.id].includes(book.isbn) ? "Unvote" : "Vote"}
                                    </Button> 
                                </div> 
                                : null
                            }
                        </Card>
                    </div>)
                )}
            </div>
            }
            {props.type === "hosting" ? 
            <div>
                {event.can_add_books 
                ? <div>
                    <Button className="button" onClick={updateEventBooks(event.id, "suggest")}>
                        Stop Book Suggestions
                    </Button>
                    <Button className="button" onClick={() => history.push(`/user/${event.id}/${props.type}`)}>
                        Suggest a Book
                    </Button>
                </div> 
                : <Button className="button" onClick={updateEventBooks(event.id, "suggest")}>
                    Allow Book Suggestions
                </Button>
                }
                {event.can_vote
                ? <Button className="button" onClick={updateEventBooks(event.id, "vote")}>
                    Stop the Voting
                </Button> 
                : <Button className="button" onClick={updateEventBooks(event.id, "vote")}>
                    Start the Voting
                </Button>
                }
                {/* <Button className="button" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) onConfirm(deleteEvent(event.id))}}>  */}
                <Button className="button" onClick={deleteEvent(event.id)}>
                    Delete Event
                </Button>
            </div>
            : 
            <div>
            {event.can_add_books 
                ? 
                    <Button className="button" onClick={() => history.push(`/user/${event.id}/${props.type}`)}>Suggest a Book</Button> 
                : null}
                <Button className="button" onClick={unAttend}>I can no longer attend</Button>
            </div>
        }
        </Card>)
    )
}

export default EventDetails;