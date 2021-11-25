import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { db } from '../utils/firebase.js'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import "./CSS/CourseList.css";
import { TermContext } from '../contexts/TermContext';
import dotenv from 'dotenv'
import axios from 'axios';
dotenv.config();


function CourseList(props) {
    const user = useContext(UserContext);
    const termInfo = useContext(TermContext);
    const [courses, setCourses] = useState([]);
    const [subjectCode, setSubjectCode] = useState("");
    const [catalogCode, setCatalogCode] = useState("");

    const showCourses = async () => {

        const userRef = doc(db, "users", user.uid);
        const getUser = await getDoc(userRef);
        const userData = getUser.data();

        const listCourses = userData.courses.map(course => <div>{course}</div>);

        setCourses(<div>{listCourses}</div>);
    }

    useEffect(() => {
        showCourses();
    }, [])



    return (
        <Container fluid id="course-list">
            <Row id="header">
                {/* <Col md={6} id="welcome-msg">Welcome back, {user.displayName}</Col> */}
                <Col md={6} id="date">Today is Nov. 22, 2021</Col>
            </Row>


            <Form id="search-lectures"
                onSubmit={(event) => {

                    event.preventDefault();
                    console.log(process.env.REACT_APP_UW_KEY);
                    let options = {
                        method: "GET",
                        url: "https://openapi.data.uwaterloo.ca/v3/Courses/",
                        headers: {

                            'x-api-key': process.env.REACT_APP_UW_KEY,
                        },

                        params: {
                            termCode: termInfo.termCode,
                            subject: subjectCode,
                            catalogNumber: catalogCode
                        }
                    }

                    axios.request(options).then(result => {
                        console.log(result);
                    }).catch(err => console.log(err))

                }}>
                <div id="search-header">Find bad lectures.</div>
                <Form.Group
                    className="justify-content-center"
                    id="formSubjectCode">
                    <Form.Control
                        onChange={e => setSubjectCode(e.target.value)}
                        placeholder="Subject code (e.g. MATH)"
                        required />

                </Form.Group>

                <Form.Group
                    className="justify-content-center"
                    id="formCatalogCode">
                    <Form.Control
                        onChange={e => setCatalogCode(e.target.value)}
                        placeholder="Catalog code (e.g. 135)"
                        required />
                </Form.Group>
                <Button type="submit">Find lectures</Button>
            </Form>




            <Container id="subscriptions">
                <div>Your lecture subscriptions:</div>
                {courses}
            </Container>

        </Container>
    );
}

export default CourseList;