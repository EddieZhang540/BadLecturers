import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserProvider';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./CSS/NavBar.css";
import logo from '../logo.png';

function NavBar() {
    const user = useContext(UserContext);
    return (
        <Container fluid>
            <Row id="nav-bar" className="align-items-center">
                <Col className="d-none d-lg-block" xs={3}>
                    <Link to="">
                        <img src={logo} alt="" width={40} height={40} style = {{marginRight: "1em"}} />
                        <span>BadLecturers</span>
                    </Link>
                </Col>

                {/* TODO: Dropdown menu here */}
                <Col className="d-lg-none" xs={4}>Dropdown</Col>

                {/*TODO: Navbar options*/}
                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    <Link to="">Home</Link>
                </Col>

                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    <Link to="login">Login</Link>
                </Col>
                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    <Link to="">Help</Link>
                </Col>
                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    <Link to="">Contact</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default NavBar;