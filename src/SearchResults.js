import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container } from 'react-bootstrap';

import BookTile from "./BookTile"

function SearchResults(props) {

    const { urlQuery } = useParams();
    const content = []
    const [books, setBooks] = useState([]);
    let bookKey = ''

    useEffect(() =>  {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${urlQuery}&maxResults=20`)
        .then (response => response.json())
        .then (result => setBooks(result.items))
        .then(window.scrollTo(0, 0))
        }, [props.bookQuery])    

        
    let i = 0
    for (const book of books) {
        
        bookKey = book.id
        // Sometimes the id is the same for two books being returned by Google Books.... 

        content.push(<BookTile key={i} book={book} userLoggedIn={props.userLoggedIn} userCategories={props.userCategories} />);
        i += 1 
    }
        
    return <Container>{content !== [] ? content : "Nothing found!"}</Container>

}

export default SearchResults;