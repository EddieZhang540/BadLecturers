import React, { useEffect, useState, useContext } from 'react';
import { update, doc, collection } from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import './CSS/Post.css'
import dateFormat from "dateformat";
import { Link } from 'react-router-dom';
import { db } from '../utils/firebase';


function Post(props) {
    const user = useContext(UserContext);
    const postData = props.data;
    const postRef = db.collection('courses').doc(postData.courseId).collection('posts').doc(postData.id);
    const increment = firebase.firestore.FieldValue.increment(1);
    const timestamp = new Date(postData.date);
    const [likes, setLikes] = useState(0);

    // Upvote handler
    const upvotePost = () => {
        postData.likes++;
        setLikes(postData.likes);
        postRef.update({ likes: increment });
    }

    // debugging can remove later
    useEffect(() => {

    }, [])

    return (
        <Row>
            <Col xs="auto" id="likes">
                <div id = "like-counter">{postData.likes}</div>
                <Button onClick={() => upvotePost()}>Upvote</Button>
            </Col>
            <Col>
                <MyLink preview={props.preview} data={props.data}>
                    <Container fluid id="post">
                        <Row style={{ alignItems: "center" }}>
                            <Col id="post-title">{props.data.title}</Col>
                            <Col>
                                <div id="post-date">{dateFormat(timestamp, "mm/d/yyyy, h:MM TT")}</div>
                            </Col>

                        </Row>
                        <div id="post-description">{props.data.desc}</div>
                    </Container>
                </MyLink>
            </Col>



        </Row>



    );
}

const MyLink = (props) => {
    return (props.preview ?
        <Link to={`p/${props.data.id}`}
            state={{ data: props.data }}
            style={{ textDecoration: "none" }}>
            {props.children}
        </Link> :
        <div>{props.children}</div>)
}

export default Post;