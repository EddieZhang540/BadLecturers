import { useEffect, useState, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { UserContext } from '../contexts/UserProvider';
import "./CSS/Course.css";

function CourseList(props) {
    const user = useContext(UserContext);
    return (
        <div id = "course-list">
            Welcome back, {user.displayName}

        </div>
    );
}

export default CourseList;