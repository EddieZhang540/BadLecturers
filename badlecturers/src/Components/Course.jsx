import { useEffect, useState, useContext } from 'react';
import { Container, Row, Button, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { useParams } from 'react-router-dom';
import { db } from '../utils/firebase';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore'
import "./CSS/Course.css";

function Course() {
    const user = useContext(UserContext);
    const courseId = useParams().courseId;
    const courseRef = db.collection('courses').doc(courseId);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const initializeWithCourseData = async () => {
        const courseData = (await getDoc(courseRef)).data();
        setCourse(courseData);
        setIsLoading(false);
    }

    useEffect(() => {
        initializeWithCourseData();
    }, [])

    return (
        (!isLoading ?
            <Container id="course-page" fluid>
                <Row id="course-header">
                    <Col md = "3">
                        <div id="course-title">{course.subjectCode} {course.catalogNumber}</div>
                        <div id="course-subtitle">{course.title}</div>
                    </Col>
                    <Col md="3">
                        <Button id = "join-button">Subscribe</Button>
                    </Col>
                    <Col xxl = "1" lg = "2" md = "3">
                        <DropdownButton id="sort-button" title = "Sort posts by">
                            <Dropdown.Item>Most recent</Dropdown.Item>
                            <Dropdown.Item>Most liked</Dropdown.Item>
                            <Dropdown.Item>Most commented</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                    <Col xxl="1" lg = "2" md = "3">
                        <Button>Create Post</Button>
                    </Col>

                    
                </Row>

                <Container id="posts">


                </Container>

            </Container>


            :
            // placeholder - add fading loading screen later
            <div>loading</div>)

    );

}

export default Course;