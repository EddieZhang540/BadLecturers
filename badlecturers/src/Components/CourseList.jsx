import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { db } from '../utils/firebase.js'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import "./CSS/CourseList.css";

function CourseList(props) {
    const user = useContext(UserContext);
    const [courses, setCourses] = useState([]);

    const showCourses = async () => {

        const userRef = doc(db, "users", user.uid);
        const getUser = await getDoc(userRef);
        const userData = getUser.data();

        const listCourses = userData.courses.map(course => <div>{course}</div>);

        setCourses(<div>{listCourses}</div>);
    }

    // useEffect(() => {
    //     showCourses();
    // }, [])



    return (
        <Container fluid id="course-list">
            <Row id="header">
                <Col md={6} id="welcome-msg">Welcome back, {user.displayName}</Col>
                <Col md={6} id="date">Today is Nov. 22, 2021</Col>
            </Row>

            <Container id="subscriptions">
                <div>Your lecture subscriptions:</div>
                {courses}
            </Container>

        </Container>
    );
}

export default CourseList;