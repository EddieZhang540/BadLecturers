import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserProvider';
import { logOut, signInWithGoogle, auth } from '../utils/firebase';


function Login() {
    let navigate = useNavigate();
    const user = useContext(UserContext);

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <button onClick={logOut}>Log out</button>
        </div>
    );
}

export default Login;