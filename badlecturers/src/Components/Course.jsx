import { useEffect, useState, useContext } from 'react';
import { Container, Row, Button, Col, DropdownButton, Dropdown, Form, FloatingLabel } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { useParams } from 'react-router-dom';
import { db } from '../utils/firebase';
import { collection, doc, setDoc, getDocs, addDoc, query, getDoc } from 'firebase/firestore'
import "./CSS/Course.css";
import Post from './Post';

function Course() {
    const user = useContext(UserContext);
    const courseId = useParams().courseId;
    const courseRef = db.collection('courses').doc(courseId);
    const postRef = db.collection('courses').doc(courseId).collection('posts')
    const [course, setCourse] = useState(null);
    const [editing, setEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    /****** Post editor states and handlers ******/
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")

    const handleTitle = (e) => setTitle(e.target.value);
    const handleDesc = (e) => setDesc(e.target.value);

    /****** Refresh data ******/
    const [posts, setPosts] = useState(null);

    const refreshPosts = async () => {
        let tempPosts = [];
        const q = query(postRef);
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {

            tempPosts.push(<Post data = {doc.data()}/>);
        })

        setPosts(tempPosts);
    }

    /****** Initialization ******/
    const initializeWithCourseData = async () => {
        const courseData = (await getDoc(courseRef)).data();
        setCourse(courseData);
        setIsLoading(false);
    }

    useEffect(() => {
        initializeWithCourseData();
        refreshPosts();
    }, [])

    return (
        (!isLoading ?
            <Container id="course-page" fluid>
                <Row id="course-header">
                    <Col md="3">
                        <div id="course-title">{course.subjectCode} {course.catalogNumber}</div>
                        <div id="course-subtitle">{course.title}</div>
                    </Col>
                    <Col md="3">
                        <Button id="join-button">Subscribe</Button>
                    </Col>
                    <Col xxl="1" lg="2" md="3">
                        <DropdownButton id="sort-button" title="Sort posts by">
                            <Dropdown.Item>Most recent</Dropdown.Item>
                            <Dropdown.Item>Most liked</Dropdown.Item>
                            <Dropdown.Item>Most commented</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                    <Col xxl="2" lg="2" md="3">
                        <Button onClick={() => { setEditing(!editing) }}>{editing ? "Discard post" : "Create post"}</Button>
                    </Col>


                </Row>

                <Container id="post-list">
                    {editing &&
                        <Form id="post-editor" autocomplete="off"
                            onSubmit={e => {
                                e.preventDefault();

                                // TODO: Do not allow post submission if title is missing
                                postRef.add({ title: title, desc: desc });
                                refreshPosts();

                            }}>
                            <div>Create a post</div>
                            <Form.Control
                                required
                                onChange={handleTitle}
                                value={title}
                                id="edit-title"
                                placeholder="Enter a helpful title" />
                            <FloatingLabel label="Enter a description">
                                <Form.Control
                                    onChange={handleDesc}
                                    value={desc}
                                    as="textarea"
                                    id="edit-desc" />
                            </FloatingLabel>

                            <Button type="submit">Submit post</Button>
                        </Form>
                    }
                    {posts}
                </Container>

            </Container>


            :
            // placeholder - add fading loading screen later
            <div>loading</div>)

    );

}

export default Course;