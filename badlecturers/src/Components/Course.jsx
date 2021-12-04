import { useEffect, useState, useContext, useMemo } from 'react';
import { Container, Row, Button, Col, DropdownButton, Dropdown, Form, FloatingLabel } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { useParams } from 'react-router-dom';
import { storage, db } from '../utils/firebase';
import { collection, doc, setDoc, getDocs, addDoc, query, getDoc } from 'firebase/firestore';
import 'firebase/storage';
import "./CSS/Course.css";
import Post from './Post';
import FadeIn from 'react-fade-in';

function Course() {
    const user = useContext(UserContext);
    const courseId = useParams().courseId;
    const courseRef = db.collection('courses').doc(courseId);
    const postRef = db.collection('courses').doc(courseId).collection('posts')
    const [course, setCourse] = useState(null);
    const [editing, setEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lectureVideoLink, setLectureVideoLink] = useState('');


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

    /***** Upload files *****/
    const handleFileUpload = async (e) => {
        setLectureVideoLink("loading");
        const file = e.target.files[0];
        // storage reference - pointer to root folder in firebase storage
        const storageRef = storage.ref();

        if (file == null) {
            console.log("no file");
        } else {
            // file reference - make a new pointer with the file's name inside the video folder
            // TODO: USE SOME OTHER IDENTIFIER FOR FILES SO USERS CAN UPLOAD FILES WITH THE SAME NAME 
            const fileRef = storageRef.child('lectureVideos/' + file.name);
            // async upload
            await fileRef.put(file);
            // get the link to the file
            setLectureVideoLink(await fileRef.getDownloadURL());
        }
    }

    /****** Render ******/
    return (
        (!isLoading ?
            <FadeIn>
                <Container id="course-page" fluid>
                    <Row id="course-header">
                        <Col md="auto">
                            <div id="course-title">{course.subjectCode} {course.catalogNumber}</div>
                            <div id="course-subtitle">{course.title}</div>
                        </Col>
                        <Col xs="auto">
                            <Button className="header-buttons"><i className="fas fa-plus" /> Subscribe</Button>
                        </Col>
                        <Col xs="auto">
                            <Button className="header-buttons" onClick={() => setEditing(!editing)}><i className="fas fa-sticky-note" /> {editing ? "Close editor" : "Create post"}</Button>
                        </Col>
                        <Col>
                            <DropdownButton
                                style={{ float: "right" }}
                                title={<i className="fas fa-sort-amount-down"></i>}>
                                <Dropdown.Item onClick={() => sortBy("recent")}>Most recent</Dropdown.Item>
                                <Dropdown.Item onClick={() => sortBy("liked")}>Most liked</Dropdown.Item>
                                <Dropdown.Item>Most commented</Dropdown.Item>
                            </DropdownButton>
                        </Col>



                    </Row>

                    <Container id="post-list">
                        {editing &&
                            <Form id="post-editor" autoComplete="off"
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
                                        lectureVideoLink: lectureVideoLink,
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

                                <Form.Control type="file" onChange={handleFileUpload}></Form.Control>

                                <Button
                                    type="submit"
                                    // wait for vid upload
                                    disabled={lectureVideoLink === "loading" ? true : false}>
                                    Submit post
                                </Button>
                            </Form>
                        }
                        {posts}
                    </Container>

                </Container>
            </FadeIn>

            :
            // placeholder - add fading loading screen later
            <div></div>)

    );

}

export default Course;