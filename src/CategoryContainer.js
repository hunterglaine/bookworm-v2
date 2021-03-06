import React, { useRef } from "react";

import { 
    Row, 
    Col,
    Button,
    Container,
    FormControl,
    Form
} from 'react-bootstrap';

import Book from "./Book"

function CategoryContainer(props) {
    
    const labelChange = useRef("");
    const booksInCategory = [];

    const showForm = (arg) => (evt) => {
        evt.preventDefault();

        if(arg === 1) {
                document.getElementById(`change-label-${props.label}`).style.visibility="visible";
            }
        else if (arg === 0) {
             document.getElementById(`change-label-${props.label}`).style.visibility="hidden";
             document.getElementById(`change-label-${props.label}`).reset();
        }
    }

    const updateCategory = (evt) => {
        evt.preventDefault();
        console.log("This is the labelChange.current useRef:", labelChange.current)
            fetch("/categories", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({"old_label": props.label,
                                    "new_label": labelChange.current}),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                props.setNewLabel(data.label)
                document.getElementById(`change-label-${props.label}`).style.visibility="hidden";
                document.getElementById(`change-label-${props.label}`).reset();
        })
    }

    const deleteCategory = (evt) => {
        evt.preventDefault();
        fetch("/categories", {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({"label": props.label}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            props.setNewLabel(data["success"])
        })
    }


    for (const book of props.books) {
        booksInCategory.push(<Book key={book.isbn} 
                                    book={book} 
                                    setBookForDetails={props.setBookForDetails} 
                                    categoryLabel={props.label}
                                    eventId={props.eventId}
                                    type={props.type} />)
    }
    
    return ( 
        <Container className="bookshelf">
        <Row>
            <Col sm={4}><h3 className="label-bg">{props.label}</h3></Col>
            <Col sm={3.4}>
            <Form id={`change-label-${props.label}`} onSubmit={updateCategory} style={{visibility: "hidden"}} >
                <FormControl className="margin-down" type="text" placeholder={props.label} onChange={(e) => labelChange.current = (e.target.value)}  />
                <Button className="button" type="button" onClick={showForm(0)}>Nevermind</Button>
                <Button className="button" type="submit" >Submit</Button>
            </Form>
            </Col>
            <Col sm={2.4}>
            <Button className="button" onClick={showForm(1)}>Change Shelf Name</Button>
            </Col>
            <Col sm={2.2}>
            <Button className="button" onClick={deleteCategory}>Delete Shelf</Button>
            </Col>
        </Row>
        <div className="scrolling-wrapper-flexbox">{booksInCategory}</div>
        <Row className="shelf-board"></Row>
        </Container>
    )
}

export default CategoryContainer;