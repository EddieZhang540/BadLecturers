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
            id: 0,
            //name gets searched as user types
            name: "MATH 135",
        },
        {
            id: 1,
            name: "MATH 136",
        },
    ]

    const handleOnSearch = (input, results) => {
        try {
            // updated as user types / every 100ms & takes the first (most compatible) result returned by autosuggest
            let c = results[0].name.match(/(\d+)/).index;
            setSubjectCode(results[0].name.substring(0, c).trim()); //subject
            setCatalogCode(results[0].name.substring(c)); //catalog

            console.log(results[0].name.substring(0, c).trim());
            console.log(results[0].name.substring(c));
        } catch (err) {
            /* TODO: Handle case when user searches for a course not in course list - Maybe prompt user to add a new entry?*/
        }
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
                            inputDebounce={100}
                            maxResults={5}
                            placeholder="Subject code (e.g. MATH 135)"
                            styling={{ borderRadius: "3px", }}
                            onSearch={handleOnSearch}
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