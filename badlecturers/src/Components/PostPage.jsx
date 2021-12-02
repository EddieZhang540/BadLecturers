import { useEffect, useState } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import dateFormat from 'dateformat';
import './CSS/PostPage.css';
import Post from './Post';

function PostPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const postData = location.state.data;
    const timeStamp = new Date(postData.date);

    useEffect(() => {

    }, [])

    return (
        <Container fluid>
            <Post data={postData} preview = {false} />

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