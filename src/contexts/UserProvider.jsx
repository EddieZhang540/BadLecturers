import React, { useState, useEffect, createContext } from "react";
import {useNavigate} from 'react-router-dom'
import { auth } from "../utils/firebase"

// Context storing the current user 
export const UserContext = React.createContext({ user: null })

// Returns context provider for UserContext
export const UserProvider = ({ children }) => {
    let navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            // navigate("/", { replace: true })
        })
    }, [])
    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}