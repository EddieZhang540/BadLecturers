import { Col, Container, Row } from "react-bootstrap";
import './CSS/Comment.css';
import dateFormat from "dateformat";

function Comment(props) {
    const timestamp = new Date(props.data.date);

    return (
        <Container id = "comment" fluid>
            <Row style = {{alignItems: "center"}}>
                <Col xs = "auto" id = "comment-author-name">{props.data.authorName}</Col>
                <Col>{dateFormat(timestamp, "mm/d/yyyy, h:MM TT")}</Col>
            </Row>
            <div id = "comment-content">{props.data.comment}</div>
        </Container>
    );
}

export default Comment;