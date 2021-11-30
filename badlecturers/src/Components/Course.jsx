import { useEffect, useState, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
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
        console.log(courseData);
        setCourse(courseData);
        setIsLoading(false);
    }

    useEffect(() => {
        initializeWithCourseData();
    }, [])

    return (
        (!isLoading ? 
        <Container fluid>
            <div>{course.subjectCode} {course.catalogNumber}</div>
        </Container> 
        

        : 
        // placeholder - add fading loading screen later
        <div>loading</div>)

    );

}

export default Course;