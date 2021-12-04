import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { db } from '../utils/firebase.js';
import { collection, doc, setDoc, getDocs, addDoc, get, query, getDoc } from 'firebase/firestore'
import dateFormat from 'dateformat';
import './CSS/PostPage.css';
import Post from './Post';
import { UserContext } from '../contexts/UserProvider.jsx';
import Comment from './Comment'

import { auth } from '../utils/firebase.js';

import FadeIn from 'react-fade-in/lib/FadeIn';

function PostPage(props) {
    const user = useContext(UserContext);
    const location = useLocation();
    const params = useParams();
    const postRef = db.collection("courses").doc(params.courseId).collection("posts").doc(params.postId);
    const [postData, setPostData] = useState(null);
    const [comment, setComment] = useState("");

    const getPostData = async () => {
        const tempPostData = await getDoc(postRef);
        setPostData(tempPostData.data());
    }

    const handleComment = (e) => setComment(e.target.value);


    // Getting setting comments
    const [commentData, setCommentData] = useState([]);
    const [comments, setComments] = useState(null);

    const refreshComments = async () => {
        let tempComments = [];
        const q = query(postRef.collection('comments'));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            let newCommentData = doc.data();
            newCommentData.id = doc.id;
            if ("authorName" in doc.data())
                tempComments.push(newCommentData);
        })
        tempComments.sort((a, b) => (a.date < b.date) ? 1 : -1);
        setCommentData(tempComments);
    }

    useEffect(() => {
        let tempComments = [];
        commentData.forEach(newData => {
            tempComments.push(<Comment data={newData} />)
        });
        setComments(tempComments);
    }, [commentData])


    useEffect(() => {
        console.log(auth.currentUser);
        if (location.state === null) {
            getPostData();
        } else {
            setPostData(location.state.data);
            console.log(location.state.data);
        }

        refreshComments();
    }, [])

    return (
        <Container fluid>
            {postData && <Post data={postData} preview={false} />}

            <Container id="comments">
                <div id="comment-header">Comments</div>
                <Form onSubmit={(event) => {
                    event.preventDefault();
                    const newComment = {
                        comment: comment,
                        authorName: user.displayName,
                        authorId: user.uid,
                        date: (new Date()).getTime()
                    }
                    postRef.collection('comments').add(newComment);
                    setComment("");
                    refreshComments();
                }}>
                    <Row id="comment-editor">
                        <Col xs="9">
                            <Form.Control
                                required
                                id="comment-box"
                                onChange={handleComment}
                                value={comment}
                                as="textarea"
                                placeholder="Leave a comment!" />
                        </Col>
                        <Col xs="2">
                            <Button id="submit-comment" type="submit">Submit</Button>
                        </Col>
                    </Row>
                    <FadeIn>
                        {comments}
                    </FadeIn>

                </Form>

            </Container>
        </Container >
    );
}

export default PostPage;