import { useEffect, useState, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import "./CSS/Course.css";

function Course(props) {
    const user = useContext(UserContext);
    return (
        <div id = "course-page">
            <div id = "name">{props.course.name}</div>

        </div>
    );
}

export default Course;