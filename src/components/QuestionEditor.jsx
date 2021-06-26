import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { nanoid } from "nanoid";
import { nextAnswerIdAlphabet, prevAnswerIdAlphabet } from "../utils/Questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faCheck,
    faTrashAlt,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./QuestionEditor.scss";
import { _throw } from "../utils/utils";

export default function QuestionEditor(props) {
    const {
        title: pTitle = "",
        questionType: pQuestionType = "",
        explain: pExplain = "",
        choices: pChoices = pQuestionType === "true-false"
            ? { A: true, B: false }
            : { A: "", B: "", C: "", D: "" },
        correct: pCorrect = [],
        questionId: pQuestionId = nanoid(),
        questionNo: pQuestionNo = 1,
        image: pImage = null,
    } = props.question || {};

    const deleteQuestion = props.delete;
    const quizId = props.quizId || "";
    const [title, setTitle] = useState(pTitle);
    const [explain, setExplain] = useState(pExplain);
    const [choices, setChoices] = useState(Object.entries(pChoices));
    const [correct, setCorrect] = useState(pCorrect);
    const [questionType, setQuestionType] = useState(pQuestionType);
    const [questionId, setQuestionId] = useState(pQuestionId);
    const [img, setImg] = useState(pImage);
    const [imgPreview, setImgPreview] = useState("");
    const [isLabelVisible, setIsLabelVisible] = useState(
        questionType === "multiple" ? true : false
    );
    const [isChangeAnsQuantAllowed, setIsChangeAnsQuantAllowed] = useState(
        questionType !== "true-false" ? true : false
    );
    const [isShortAnswer, setIsShortAnswer] = useState(
        questionType === "short-answer" ? true : false
    );

    const fileInputRef = useRef(null);

    const handleOnClickAddAnswer = (e) => {
        console.log(correct);
        if (choices.length >= 26) {
            return;
        }
        if (choices.length <= 0) {
            setChoices([["A", ""]]);
            return;
        }
        const lastAnswerKey = choices[choices.length - 1][0];
        setChoices((prevState) => [
            ...prevState,
            [nextAnswerIdAlphabet(lastAnswerKey), ""],
        ]);
    };

    const handleOnClickRemoveAnswer = (index) => {
        console.log(choices);
        console.log(index);
        const newChoices = choices.slice();
        let lastChoice = newChoices[index][0];
        updateCorrectAnswer(lastChoice);
        for (let i = index; i < newChoices.length; i++) {
            [newChoices[i][0], lastChoice] = [lastChoice, newChoices[i][0]];
        }
        newChoices.splice(index, 1);
        console.log(newChoices);
        setChoices(newChoices);
    };

    const handleOnChangeCorrectAnswer = (i, key) => {
        // if (choices[i][1] === "") return;
        const newCorrect = questionType === "true-false" ? [] : correct.slice();
        const index = newCorrect.indexOf(key);
        console.log(index);
        console.log(key);
        if (index > -1) {
            newCorrect.splice(index, 1);
        } else {
            newCorrect.push(key);
        }
        newCorrect.sort();
        setCorrect(newCorrect);
    };

    const handleOnChangeAnswerInput = (event, index, key) => {
        const newChoices = choices.slice();
        newChoices[index][1] = event.target.value;
        setChoices(newChoices);
    };

    const handleOnChangeImage = (event) => {
        const file = event.target.files[0];
        if (file && file.type.substr(0, 5) === "image") {
            setImg(file);
        } else {
            setImg(null);
        }
    };

    const updateCorrectAnswer = (key) => {
        const newCorrect = correct.slice();
        const index = newCorrect.indexOf(key);
        if (index > -1) {
            newCorrect.splice(index, 1);
        }
        for (let i = 0; i < newCorrect.length; i++) {
            if (newCorrect[i] > key) {
                newCorrect[i] = prevAnswerIdAlphabet(newCorrect[i]);
            }
        }

        console.log(newCorrect);
        setCorrect(newCorrect);
    };

    /***
     *
     *
     *
     */
    const createQuestionObject = () => {
        if (title === "") {
            _throw("I don't know what your question is");
        }
        if (quizId === "") {
            _throw("Sorry! I can't find your Quiz :(");
        }
        if (questionType === "multiple" && choices.length < 2) {
            _throw(
                "Your multiple choice question must have at least two answers"
            );
        }
        if (choices.length < 1) {
            _throw("Oops! Your question doesn't have any answers");
        }
        if (questionType !== "short-answer" && correct.length === 0) {
            _throw("There must be at least one correct answer :(");
        }
        for (const [key, value] of choices) {
            if (value === "") {
                _throw("Your answer cannot be blank!");
            }
        }
        const question = {};
        question.title = title;
        question.question_type = questionType;
        question.explain = explain;
        question.quizId = quizId;
        question.choices = Object.fromEntries(choices);
        question.correct = correct;
        question.img = img;
        return question;
    };

    useEffect(() => {
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(img);
            console.log(img);
        } else {
            setImgPreview("");
        }
    }, [img]);

    /***
     *
     *
     *
     */
    return (
        <Container
            key={questionId}
            fluid
            className="question-editor flex items-start text-base"
        >
            <div className="grid question-grid flex-1 ">
                <div className="grid question-fields  w-100 wm-64r">
                    <div className="w-100 h-100 flex justify-center align-center">
                        <span>{pQuestionNo + "."}</span>
                    </div>
                    <div className="flex col-start-2">
                        <input
                            className="flex-1 question-input"
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                            placeholder="Have a question to ask?"
                        ></input>
                    </div>
                </div>
                <div className="image-field col-start-2--lg row-span-2">
                    <div
                        className="w-100 h-100"
                        onClick={() => {
                            fileInputRef.current.click();
                        }}
                    >
                        <img
                            className="w-100 h-100"
                            src={imgPreview}
                            style={{
                                objectFit: "cover",
                            }}
                            alt=""
                            onLoad={(event) => {event.target.style.display = "inline"}}
                            onError={(event) => {event.target.style.display = "none"}}
                        />
                        <input
                            type="file"
                            style={{
                                display: "none",
                                width: "1px",
                                height: "1px",
                            }}
                            ref={fileInputRef}
                            accept="image/*"
                            onClick={(e) => {
                                e.target.value = null;
                            }}
                            onChange={handleOnChangeImage}
                        />
                    </div>
                    <div
                        className="w-3r h-3r flex align-center justify-center image-delete"
                        onClick={() => {
                            setImg(null);
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                    </div>
                </div>
                <div className="row-start-2--lg -mr-3r mr-0--md mt-1r">
                    {choices.map(([key, value], i) => (
                        <div
                            key={key}
                            className="grid question-fields mt-1r wm-64r"
                        >
                            {isLabelVisible ? (
                                <div className="flex flex-none align-center justify-center w-100 h-100">
                                    <div className="order order--rounded ">
                                        <span>{key}</span>
                                    </div>
                                </div>
                            ) : isShortAnswer ? (
                                <div className="w-3r h-3r flex justify-center align-center"></div>
                            ) : null}
                            <div className="flex col-start-2 col-span-2 flex-1">
                                {!isShortAnswer ? (
                                    <div className="w-3r h-3r flex justify-center align-center">
                                        <div className="checkbox">
                                            <div className="checkbox-rounded">
                                                <input
                                                    id={key}
                                                    type="checkbox"
                                                    checked={correct.includes(
                                                        key
                                                    )}
                                                    onChange={() =>
                                                        handleOnChangeCorrectAnswer(
                                                            i,
                                                            key
                                                        )
                                                    }
                                                ></input>
                                                <label htmlFor={key}></label>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <input
                                    className="flex-1 question-input"
                                    type="text"
                                    name="choices"
                                    value={value}
                                    data-key={key}
                                    placeholder={
                                        !isShortAnswer
                                            ? "Answer " + key
                                            : "Correct Answer"
                                    }
                                    onChange={(e) => {
                                        handleOnChangeAnswerInput(e, i, key);
                                    }}
                                    readOnly={questionType === "true-false"}
                                ></input>
                                {isChangeAnsQuantAllowed ? (
                                    <div
                                        className="w-3r h-3r flex align-center justify-center"
                                        onClick={() =>
                                            handleOnClickRemoveAnswer(i)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                        ></FontAwesomeIcon>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                    {isChangeAnsQuantAllowed ? (
                        <div className="grid question-fields mt-1r">
                            <div className="flex col-start-2">
                                {!isShortAnswer ? (
                                    <div className="w-3r h-3r"></div>
                                ) : null}
                                <Button
                                    onClick={handleOnClickAddAnswer}
                                    className="btn-add-ans text-sm"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                    ></FontAwesomeIcon>
                                    &nbsp;Add Answer
                                </Button>
                            </div>
                        </div>
                    ) : null}
                    <div
                        key="explanation"
                        className="grid question-fields mt-1r  wm-64r"
                    >
                        <div className="flex align-center justify-center w-100 h-100">
                            <div className="order order--rounded2 ">
                                <span>i</span>
                            </div>
                        </div>
                        <div className="flex col-start-2">
                            <input
                                className="flex-1 question-input"
                                type="text"
                                name="choices"
                                value={explain}
                                placeholder="An explanation, if you like"
                                onChange={(e) => {
                                    setExplain(e.target.value);
                                }}
                            ></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-none button-field">
                <Button
                    className="w-3r h-3r"
                    onClick={() => {
                        try {
                            const question = createQuestionObject();
                            console.log(question);
                        } catch (err) {
                            console.log(err);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCheck} size="lg"></FontAwesomeIcon>
                </Button>
                <Button
                    className="w-3r h-3r"
                    variant="outline-light"
                    style={{ backgroundColor: "#FFF", color: "#0099c7" }}
                    onClick={() => deleteQuestion()}
                >
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        size="lg"
                    ></FontAwesomeIcon>
                </Button>
            </div>
        </Container>
    );
}