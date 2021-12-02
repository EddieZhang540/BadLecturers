import { useEffect, useState, useContext, useMemo } from 'react';
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
    const [postData, setPostData] = useState([]);
    const [posts, setPosts] = useState([]);

    // Gets firestore's post data and updates postData
    const refreshPosts = async () => {
        let tempData = [];
        const q = query(postRef);

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            let newPostData = doc.data();
            newPostData.id = doc.id;
            if (doc.id !== "init")
                tempData.push(newPostData);
        })
        tempData.sort((a, b) => (a.date < b.date) ? 1 : -1);
        setPostData(tempData);
    }

    // sorts postData by some property [option]
    const sortBy = (option) => {
        const tempData = [...postData];

        if (option === "recent") {
            setPostData(tempData.sort((a, b) => (a.date < b.date) ? 1 : -1));
        } else if (option === "liked") {
            setPostData(tempData.sort((a, b) => (a.likes < b.likes) ? 1 : -1));
        } else if (option === "commented") {
            // TODO
        }
    }

    // Re-renders posts on every update to postData
    useEffect(() => {
        let tempPosts = [];
        postData.forEach(newData => {
            tempPosts.push(<Post data={newData} preview={true} />)
        });
        setPosts(tempPosts);
    }, [postData])


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

    /****** Render ******/
    return (
        (!isLoading ?
            <Container id="course-page" fluid>
                <Row id="course-header">
                    <Col md="auto">
                        <div id="course-title">{course.subjectCode} {course.catalogNumber}</div>
                        <div id="course-subtitle">{course.title}</div>
                    </Col>
                    <Col xs="auto">
                        <Button className="header-buttons"><i class="fas fa-plus" /> Subscribe</Button>
                    </Col>
                    <Col xs="auto">
                        <Button className="header-buttons" onClick={() => setEditing(!editing)}><i class="fas fa-sticky-note" /> {editing ? "Close editor" : "Create post"}</Button>
                    </Col>
                    <Col>
                        <DropdownButton
                            style={{ float: "right" }}
                            title={<i class="fas fa-sort-amount-down"></i>}>
                            <Dropdown.Item onClick={() => sortBy("recent")}>Most recent</Dropdown.Item>
                            <Dropdown.Item onClick={() => sortBy("liked")}>Most liked</Dropdown.Item>
                            <Dropdown.Item>Most commented</Dropdown.Item>
                        </DropdownButton>
                    </Col>



                </Row>

                <Container id="post-list">
                    {editing &&
                        <Form id="post-editor" autocomplete="off"
                            onSubmit={e => {
                                e.preventDefault();

                                // TODO: Do not allow post submission if title is missing
                                const newPost = {
                                    title: title,
                                    desc: desc,
                                    date: (new Date()).getTime(),
                                    author: user.uid,
                                    likes: 0,
                                    authorName: user.displayName,
                                    courseId: courseId,
                                }
                                postRef.add(newPost).then(result => {
                                    const newPostRef = db.collection('courses').doc(courseId)
                                        .collection('posts').doc(result.id).collection('comments');
                                    newPostRef.add({});
                                })
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