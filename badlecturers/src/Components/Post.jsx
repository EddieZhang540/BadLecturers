import React, { useEffect, useState, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import './CSS/Post.css'
import dateFormat from "dateformat";
import { Link } from 'react-router-dom';


function Post(props) {
    const user = useContext(UserContext);
    const timestamp = new Date(props.data.date);

    // debugging can remove later
    useEffect(() => {
        console.log(props.data);
    }, [])

    return (
        (props.preview ?
            <Link to={`p/${props.data.id}`}
                state={{ data: props.data }}
                style={{ textDecoration: "none" }}>
                <Container fluid id="post">
                    <Row style={{ alignItems: "flex-end" }}>
                        <Col id="post-title">{props.data.title}</Col>
                        <Col>
                            <div id="post-date">{dateFormat(timestamp, "mm/d/yyyy, h:MM TT")}</div>
                        </Col>
                    </Row>
                    <div id="post-description">{props.data.desc}</div>
                </Container>
            </Link>
            :
            <Container fluid id="post">
                <Row style={{ alignItems: "flex-end" }}>
                    <Col id="post-title">{props.data.title}</Col>
                    <Col>
                        <div id="post-date">{dateFormat(timestamp, "mm/d/yyyy, h:MM TT")}</div>
                    </Col>
                </Row>
                <div id="post-description">{props.data.desc}</div>
            </Container>
        )


    );
}

export default Post;