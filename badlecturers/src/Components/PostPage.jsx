import { useEffect, useState } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { db } from '../utils/firebase.js';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore'
import dateFormat from 'dateformat';
import './CSS/PostPage.css';
import Post from './Post';

function PostPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [postData,setPostData] = useState(null);
    let timeStamp = null;

    const getPostData = async () => {
        const postRef = db.collection("courses").doc(params.courseId).collection("posts").doc(params.postId);
        const tempPostData = await getDoc(postRef);
        setPostData(tempPostData.data());
    }

    useEffect(() => {
        if (location.state === null) {
            getPostData();
        } else {
            setPostData(location.state.data);
        }
    }, [])

    return (
        <Container fluid>
            {postData && <Post data={postData} preview={false} />}

            <Container id="comments">
                <div id="comment-header">Comments</div>
                <Form>
                    <Row id="comment-editor">
                        <Col xs="9">
                            <Form.Control
                                id="comment-box"
                                as="textarea"
                                placeholder="Leave a comment!" />
                        </Col>
                        <Col xs="2">
                            <Button id="submit-comment" type="submit">Submit</Button>
                        </Col>
                    </Row>

                </Form>

            </Container>
        </Container>
    );
}

export default PostPage;