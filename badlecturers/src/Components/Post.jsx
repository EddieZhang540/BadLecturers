import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import './CSS/Post.css'


function Post(props) {
    const user = useContext(UserContext);
    const timestamp = new Date(props.data.date).toDateString();

    return (
        <Container fluid id = "post">
            <div id = "post-title">{props.data.title}</div>
            <div style = {{float: "right"}}>Date created: {timestamp}</div>
            <div id = "post-description">{props.data.desc}</div>
        </Container>
    );
}

export default Post;