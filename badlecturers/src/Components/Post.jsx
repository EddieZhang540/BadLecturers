import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import './CSS/Post.css'


function Post(props) {
    const user = useContext(UserContext);

    return (
        <Container fluid id = "post">
            <div>THIS IS A POST</div>
            <div>{props.data.title}</div>
            <div>{props.data.desc}</div>
        </Container>
    );
}

export default Post;