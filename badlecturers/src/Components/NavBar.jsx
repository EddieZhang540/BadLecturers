import React, { useState, useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import "./CSS/NavBar.css"

function NavBar() {
    return (
        <Container fluid>
            <Row id="nav-bar">
                {/* TODO: Dropdown menu here */} 
                <Col className = "d-lg-none" xs = {4}>Dropdown</Col>

                {/*TODO: Navbar options*/}
                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    Home
                </Col>
                <Col
                    className="d-none d-lg-block"
                    lg={1}>
                    Login
                </Col>
            </Row>
        </Container>
    );
}

export default NavBar;