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
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            navigate("/", { replace: true })
            setUser(user)
        })
    }, [])
    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}