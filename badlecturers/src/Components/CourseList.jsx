import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { db } from '../utils/firebase.js'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import "./CSS/CourseList.css";
import { TermContext } from '../contexts/TermContext';
import dotenv from 'dotenv'
import axios from 'axios';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
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

    const testCourses = [
        {
            //name shows up in suggestion
            name: "MATH 135",
            subject: "math",
            code: "135"
        },
        {
            name: "MATH 136",
            subject: "math",
            code: "136"
        },
    ]

    const handleOnSelect = (course) => {
        setSubjectCode(course.subject);
        setCatalogCode(course.code)
    }

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
                        url: `https://openapi.data.uwaterloo.ca/v3/Courses/${termInfo.termCode}/${subjectCode}/${catalogCode}`,
                        headers: {
                            'x-api-key': process.env.REACT_APP_UW_KEY,
                        },
                    }

                    axios.request(options).then(result => {
                        console.log(result);
                    }).catch(err => console.log(err))

                }}>
                <div id="search-header">Find bad lectures.</div>

                <Row className="align-items-center">
                    <Col md={8} id="formSearchSubjectCode">
                        <ReactSearchAutocomplete
                            items={testCourses}
                            autoFocus={true}
                            showIcon={false}
                            inputDebounce={100}
                            maxResults={5}
                            placeholder="Subject code (e.g. MATH 135)"
                            styling={{ border: "none", borderRadius: "3px", }}
                            onSelect={handleOnSelect}
                        />
                    </Col>
                    <Col>
                        <Button type="submit">Find lectures</Button>
                    </Col>
                </Row>

                {/* <Form.Group
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
                </Form.Group> */}

            </Form>




            <Container id="subscriptions">
                <div>Your lecture subscriptions:</div>
                {courses}
            </Container>

        </Container>
    );
}

export default CourseList;