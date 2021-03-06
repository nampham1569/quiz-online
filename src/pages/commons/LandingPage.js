import React, { useState, useEffect, useContext, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { RoomContext } from "../../context/RoomContext";
import { useWhoIsLoggedIn } from "../../utils/Users";

export default function LandingPage() {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);
    const [show, setShow] = useState(false);
    const history = useHistory();
    const whoIsLoggedIn = useWhoIsLoggedIn();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleRedirect = useCallback((url) => history.push(url), [history]);

    useEffect(() => {
        if (whoIsLoggedIn === "teacher") {
            handleRedirect("/teacher");
        }
        if (whoIsLoggedIn === "student") {
            handleRedirect("/student");
        }
    }, [user, handleRedirect]);

    return (
        <Container className="landing-container">
            <Button
                className="btn-custom btn-main text-white"
                onClick={handleShow}
            >
                Login
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                className="modal-login"
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="text-center">
                    <button
                        className="btn-login btn-student text-md"
                        onClick={() => handleRedirect("/login/student")}
                    >
                        Student Login
                    </button>
                    <button
                        className="btn-login btn-teacher text-md"
                        onClick={() => handleRedirect("/login/teacher")}
                    >
                        Teacher Login
                    </button>
                    <hr
                        style={{
                            width: "50%",
                            marginTop: 0,
                            marginBottom: "30px",
                        }}
                    ></hr>
                    <p className="text-smd font-600">
                        Don&apos;t have an account?
                    </p>
                    <p
                        className="text-md font-700 text-blue-bold"
                        id="btn-sign-up"
                        onClick={() =>
                            handleRedirect("/login/teacher/register")
                        }
                    >
                        Sign up now!&nbsp;
                        <FontAwesomeIcon icon={faCaretRight}></FontAwesomeIcon>
                    </p>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
