import React, { useState, useEffect, createContext } from "react";
import {useNavigate} from 'react-router-dom'
import { auth } from "../utils/firebase"

// Context storing the current user 
export const UserContext = React.createContext({ user: null })

// Returns context provider for UserContext
export const UserProvider = ({ children }) => {
    let navigate = useNavigate();
    const [user, setUser] = useState(null)

    // adds an observer to changes in the user's state
    /* 
    In your apps, the recommended way to know the auth status of your user is to set an 
    observer on the Auth object. You can then get the user's basic profile information from
     the User object. See Manage Users.

    In your Firebase Realtime Database and Cloud Storage Security Rules, you can get the signed-in 
    user's unique user ID from the auth variable, and use it to control what data a user can access.
    */
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            console.dir(user, { depth: null }); 
            navigate("/", { replace: true })
            
        })
    }, [])
    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}