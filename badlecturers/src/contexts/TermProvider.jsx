import axios from "axios";
import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from 'react-router-dom'
import { auth } from "../utils/firebase"

export const TermContext = React.createContext({ termInfo: null })

export const TermProvider = ({ children }) => {
    let navigate = useNavigate();
    const [term, setTerm] = useState(null)

    useEffect(() => {
        const options = {
            method: 'GET',
            url: "https://openapi.data.uwaterloo.ca/v3/Terms/current",
            headers: {
                "x-api-key": process.env.REACT_APP_UW_KEY
            }
        }

        axios.request(options).then(result => {
            console.log(result);
            setTerm(result.data);
        })
    }, [])
    return (
        <TermContext.Provider value={term}>{children}</TermContext.Provider>
    )
}