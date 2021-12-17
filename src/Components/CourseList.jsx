import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, CloseButton, Image } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import { db } from '../utils/firebase.js'
import firebase from 'firebase/compat/app';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore'
import "./CSS/CourseList.css";
import { TermContext } from '../contexts/TermProvider';
import axios from 'axios';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

// Images
import mathImg from "../assets/images/MATH-COURSE.jpg";
import sciImg from "../assets/images/SCI-COURSE.jpg";
import noMatchImg from "../assets/images/NO-MATCH.png";
import artImg from '../assets/images/ART.jpeg';
import bgImg from '../assets/images/BACKGROUND.jpg';

import dotenv from 'dotenv';
import course_list from "../.course_list.js";
import { Link } from 'react-router-dom';
dotenv.config();

const banners = {
    "MAT": mathImg,
    "SCI": sciImg,
    "ART": artImg,
    "noMatch": noMatchImg
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
    const [inputString, setInputString] = useState("");


    // Gets the current user ID
    // Gets the user's profile from DB and gets their [courses] object
    // Generates Cards for each of the user's courses in [courses]
    const showCourses = async () => {

        // Get user ID and [courses]
        const getUser = await getDoc(doc(db, "users", user.uid));
        userData = getUser.data();
        const courses = userData.courses;

        const listCourses = [];

        // Generate Cards
        for (const id of Object.keys(courses).sort()) {
            const course = courses[id];
            const courseId = course.subjectCode + course.catalogNumber;
            listCourses.push(
                <Card className="lecture-subscription" as={Col} lg="5" md="5">
                    <Card.Img variant="top" src={(course.associatedAcademicGroupCode in banners) ?
                        banners[course.associatedAcademicGroupCode] : banners["noMatch"]} />
                    <Card.Body>

                        {/* Deletes course from user's [courses] object in db */}
                        <CloseButton onClick={() => {
                            db.collection('users').doc(user.uid).set({
                                courses: {
                                    [courseId]: firebase.firestore.FieldValue.delete()
                                }
                            }, { merge: true })
                            showCourses();
                        }} className="cancel-subscription-btn" />

                        <Card.Title>{courseId}</Card.Title>
                        <Card.Subtitle>{course.title}</Card.Subtitle>

                        {/* Redirects to /:courseId */}
                        <Link className="btn btn-primary mt-3" to={`${courseId}`}>Go to course page</Link>
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

    // Initialization
    useEffect(() => {
        showCourses();
    }, [])


    // Gets subject and catalog code states and makes an API call to Waterloo's OpenAPI
    // Receives a course from Waterloo and renders it as a Card
    const handleAfterSearch = async (course) => {
        const courseId = subjectCode + catalogCode;
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
                <Card.Img variant="top" src={(course.associatedAcademicGroupCode in banners) ?
                    banners[course.associatedAcademicGroupCode] : banners["noMatch"]} />
                <Card.Body>

                    {/* Stops rendering current search result Card */}
                    <CloseButton onClick={() => setSearchResults(null)} className="cancel-subscription-btn" />

                    <Card.Title>{courseId}</Card.Title>
                    <Card.Subtitle>{course.title}</Card.Subtitle>
                    <Card.Text>
                        {course.description}
                    </Card.Text>

                    {/* Redirects to /:courseId */}
                    <Link className="btn btn-primary" style={{ marginTop: "0.5em" }} to={`${courseId}`}>Go to course page</Link>

                    {/* Adds search result to user's [courses] object in db */}
                    <Button
                        id="add-subscription-button"
                        style={{ display: "block", margin: "1em auto" }}
                        onClick={() => {
                            const userRef = db.collection('users').doc(user.uid);

                            const key = `courses.${courseId}`;
                            const newCourse = { [key]: course };

                            userRef.update(newCourse);
                            showCourses();
                        }}>Add {courseId} to Your Courses
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    const handleOnSearch = (input, results) => {
        try {
            // updated as user types / every 100ms & takes the first (most compatible) result returned by autosuggest
            setSubjectCode(results[0].subject); //subject
            setCatalogCode(results[0].catalog); //catalog

        } catch (err) {
            /* TODO: Handle case when user searches for a course not in course list - Maybe prompt user to add a new entry?*/
        }
    }
    const handleOnSelect = (item) => {
        setSubjectCode(item.subject); //subject
        setCatalogCode(item.catalog); //catalog
    }

    return (
        <Container fluid id="course-list">
            <Row>
                <Form id="search-lectures"

                    // On form button submit, make API call to Waterloo's open API
                    //    and get corresponding course info to subject and catalog code states
                    // Then, call handleAfterSearch with API call data to render search result
                    onSubmit={(event) => {
                        event.preventDefault();
                        console.log(process.env.REACT_APP_UW_KEY);
                        setInputString(subjectCode + " " + catalogCode);

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

                    {/* Search bar */}
                    <Row className="align-items-center">
                        <Col md={8} id="formSearchSubjectCode">
                            <ReactSearchAutocomplete
                                items={course_list}
                                fuseOptions={{ threshold: 0.9, keys: ["subject", "catalog"] }}
                                resultStringKeyName="display"
                                autoFocus={true}
                                inputDebounce={100}
                                maxResults={5}
                                placeholder="Subject code (e.g. MATH 135)"
                                styling={{ borderRadius: "3px", }}
                                onSearch={handleOnSearch}
                                onSelect={handleOnSelect}
                                inputSearchString={inputString}
                            />
                        </Col>
                        <Col>
                            <Button type="submit">Find lectures</Button>
                        </Col>
                    </Row>

                    {/* Search result */}
                    {searchResults}
                </Form>
            </Row>

            {/* User's course subscriptions */}
            {courses}
        </Container>
    );
}

export default CourseList;