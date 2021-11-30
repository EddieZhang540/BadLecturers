import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, CloseButton } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { db } from '../utils/firebase.js'
import firebase from 'firebase/compat/app';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore'
import "./CSS/CourseList.css";
import { TermContext } from '../contexts/TermProvider';
import axios from 'axios';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import mathImg from "../assets/images/MATH-COURSE.jpg";
import dotenv from 'dotenv'
dotenv.config();

const banners = {
    "MAT": mathImg,
    // TODO: add more course images for departments
}

function CourseList(props) {
    const user = useContext(UserContext);
    let userData = null;
    const termInfo = useContext(TermContext);
    const [courses, setCourses] = useState([]);
    const [subjectCode, setSubjectCode] = useState("");
    const [catalogCode, setCatalogCode] = useState("");
    const [searchResults, setSearchResults] = useState(null);
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
        {
            id: 2,
            name: "CS 135"
        }
    ]

    const showCourses = async () => {
        const getUser = await getDoc(doc(db, "users", user.uid));
        userData = getUser.data();
        const courses = userData.courses;

        const listCourses = [];
        for (const id of Object.keys(courses).sort()) {
            const course = courses[id];
            const courseId = course.subjectCode + " " + course.catalogNumber;
            listCourses.push(
                <Card className="lecture-subscription" as={Col} lg="3" md = "5">

                    <Card.Img variant="top" src={banners[course.associatedAcademicGroupCode]} />
                    <Card.Body>
                        <CloseButton className = "cancel-subscription-btn"/>
                        <Card.Title>{courseId}</Card.Title>
                        <Card.Subtitle>{course.title}</Card.Subtitle>
                        <Button style={{ marginTop: "0.5em" }}>Go to course page</Button>
                    </Card.Body>

                </Card>
            );
        }
        setCourses(
            <Row id="subscriptions">
                <div id="your-lectures">Your lectures</div>
                {listCourses}
            </Row>);
    }

    useEffect(() => {
        showCourses();
    }, [])

    const handleAfterSearch = async (course) => {

        const courseId = subjectCode + " " + catalogCode;
        const getCourse = await getDoc(doc(db, "courses", courseId));

        // if the course doesn't exist, initialize its course page
        if (!getCourse.exists()) {
            await setDoc(doc(db, "courses", courseId), course);

            // Initializing subcollections for the course
            const postRef = doc(db, "courses", courseId, "posts", "init");
            await setDoc(postRef, {});
        }

        setSearchResults(
            <Card id="searchResult">
                <Card.Img variant="top" src={banners[course.associatedAcademicGroupCode]} />
                <Card.Body>
                    <Card.Title>{courseId}</Card.Title>
                    <Card.Subtitle>{course.title}</Card.Subtitle>
                    <Card.Text>
                        {course.description}
                    </Card.Text>
                    <Button>Watch some bad {courseId} lectures</Button>
                    <Button
                        style={{ marginTop: "0.5em" }}
                        onClick={() => {
                            const userRef = db.collection('users').doc(user.uid);

                            const key = `courses.${courseId}`;
                            const newCourse = { [key]: course };

                            userRef.update(newCourse);
                            showCourses();
                        }}>Add {courseId} to Your Courses</Button>
                </Card.Body>
            </Card>

        );
    }

    const handleOnSearch = (input, results) => {
        try {
            // updated as user types / every 100ms & takes the first (most compatible) result returned by autosuggest
            let c = results[0].name.match(/(\d+)/).index;
            setSubjectCode(results[0].name.substring(0, c).trim()); //subject
            setCatalogCode(results[0].name.substring(c)); //catalog

            console.log(subjectCode, catalogCode);
        } catch (err) {
            /* TODO: Handle case when user searches for a course not in course list - Maybe prompt user to add a new entry?*/
        }
    }

    return (
        <Container fluid id="course-list">
            <Row id="header">
                <Col md={6} id="welcome-msg">Welcome back, {user.displayName}</Col>
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
                        console.log(result)
                        handleAfterSearch(result.data[0]);
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
                {searchResults}
            </Form>


            {courses}




        </Container>
    );
}

export default CourseList;