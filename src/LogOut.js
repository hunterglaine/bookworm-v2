import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

function LogOut(props) {
    
    let history = useHistory();
    useEffect(() => {
        props.setUserLoggedIn({userId: null, userFirstName: null, accessToken: null});
        localStorage.setItem("accessToken", null)
        localStorage.setItem("userId", null)
        localStorage.setItem("userFirstName", null)
        history.push("/login")
    }, []);
    // useEffect(() =>  {
    //     fetch("/logout", {
    //         method: "POST",
    //         credentials: "include",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     })
    //     .then (response => response.json())
    //     .then(data => {
    //             props.setUserLoggedIn({userId: null, userFirstName: null});
    //             localStorage.setItem("userId", null)
    //             localStorage.setItem("userFirstName", null)
    //             history.push("/login")
    //             alert(data["success"])
    //         }
    // )}, []);

        return <p>You have been successfully logged out!</p>
}

export default LogOut;