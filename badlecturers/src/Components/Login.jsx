import React, { useEffect, useState, useContext } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserProvider';
import { logOut, signInWithGoogle, auth } from '../utils/firebase';
import logo from '../logo.png';
import './CSS/Login.css';


function Login() {
    let navigate = useNavigate();
    const user = useContext(UserContext);

    return (
        <Container fluid>


            <Container id="login-options">
                <img src={logo} alt="" style={{ marginRight: "1em" }} />
                <div style={{ fontWeight: "800", fontSize: "3em" }}>Welcome to BadLecturers</div>
                <div id="made-for">Made for UWaterloo Project Program Fall 2021</div>
                <Button className="login-buttons" onClick={signInWithGoogle}>Sign in with Google</Button>
                <Button className="login-buttons" onClick={logOut}>Log out</Button>
            </Container>

                <Button id="github" target="_blank" href="https://github.com/EddieZhang540/BadLecturers"><i class="fab fa-github"></i> Check out our source code!</Button>



        </Container>
    );
}

export default Login;