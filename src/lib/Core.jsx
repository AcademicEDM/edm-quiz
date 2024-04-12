import React, { useState, useEffect, useCallback, Fragment } from "react";
import PropTypes from "prop-types";
import QuizResultFilter from "./core-components/QuizResultFilter";
import { checkAnswer, rawMarkup } from "./core-components/helpers";
import InstantFeedback from "./core-components/InstantFeedback";
import Explanation from "./core-components/Explanation";

const Core = ({
  quizId,
  courseId,
  quizHeader,
  questions,
  appLocale,
  showDefaultResult,
  onComplete,
  customResultPage,
  showInstantFeedback,
  continueTillCorrect,
  showColorCode,
}) => {
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [userInput, setUserInput] = useState({});
  const [filteredValue, setFilteredValue] = useState("all");
  const [showDefaultResultState, setShowDefaultResult] = useState(true);
  const [answerSelectionTypeState, setAnswerSelectionType] =
    useState(undefined);

  const [totalPoints, setTotalPoints] = useState(0);
  const [correctPoints, setCorrectPoints] = useState(0);
  const [question, setQuestion] = useState(questions[currentQuestionIndex]);
  const [questionSummary, setQuestionSummary] = useState(undefined);

  useEffect(() => {
    setShowDefaultResult(
      showDefaultResult !== undefined ? showDefaultResult : true
    );
  }, [showDefaultResult]);

  useEffect(() => {
    setQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  useEffect(() => {
    let { answerSelectionType } = question;
    // Default single to avoid code breaking due to automatic version upgrade
    setAnswerSelectionType(answerSelectionType || "single");
  }, [question, currentQuestionIndex]);

  useEffect(() => {
    if (endQuiz) {
      let totalPointsTemp = 0;
      let correctPointsTemp = 0;
      for (let i = 0; i < questions.length; i++) {
        let point = questions[i].point || 0;
        if (typeof point === "string" || point instanceof String) {
          point = parseInt(point);
        }

        totalPointsTemp = totalPointsTemp + point;

        if (correct.includes(i)) {
          correctPointsTemp = correctPointsTemp + point;
        }
      }
      setTotalPoints(totalPointsTemp);
      setCorrectPoints(correctPointsTemp);
    }
  }, [endQuiz]);

  useEffect(() => {
    setQuestionSummary({
      numberOfQuestions: questions.length,
      numberOfCorrectAnswers: correct.length,
      numberOfIncorrectAnswers: incorrect.length,
      questions: questions,
      userInput: userInput,
      totalPoints: totalPoints,
      correctPoints: correctPoints,
    });
  }, [totalPoints, correctPoints]);

  useEffect(() => {
    if (endQuiz && onComplete !== undefined && questionSummary !== undefined) {
      onComplete(questionSummary);
    }
  }, [endQuiz, questionSummary]);

  const previousQuestion = (currentQuestionIndex) => {
    if (currentQuestionIndex - 1 >= 0) {
      setIncorrectAnswer(false);
      setCorrectAnswer(false);
      setShowNextQuestionButton(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = (currentQuestionIndex) => {
    setIncorrectAnswer(false);
    setCorrectAnswer(false);
    setShowNextQuestionButton(false);
    if (currentQuestionIndex + 1 === questions.length) {
      setEndQuiz(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleChange = (event) => {
    setFilteredValue(event.target.value);
  };

  const renderAnswerInResult = (question, userInputIndexes) => {
    const { answers, correctAnswer, questionType } = question;
    let { answerSelectionType } = question;
    let answerBtnCorrectClassName;
    let answerBtnIncorrectClassName;

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || "single";

    return answers.map((answer, index) => {
      if (answerSelectionType === "single") {
        // correctAnswer - is string
        answerBtnCorrectClassName =
          `${index + 1}` === correctAnswer ? "correct" : "";
        answerBtnIncorrectClassName =
          `${index + 1}` !== correctAnswer && userInputIndexes.includes(index)
            ? "incorrect"
            : "";
      } else {
        // correctAnswer - is array of numbers
        answerBtnCorrectClassName = correctAnswer.includes(index + 1)
          ? "correct"
          : "";
        answerBtnIncorrectClassName =
          !correctAnswer.includes(index + 1) && userInputIndexes.includes(index)
            ? "incorrect"
            : "";
      }

      return (
        <button
          disabled={true}
          key={index}
          className={
            "answerBtn btn " +
            answerBtnCorrectClassName +
            answerBtnIncorrectClassName
          }
        >
          {questionType === "text" && <span>{answer}</span>}
          {questionType === "photo" && <img src={answer} alt="image" />}
        </button>
      );
    });
  };

  const renderQuizResultQuestions = useCallback(() => {
    let filteredQuestionIndexes = [];
    // let filteredUserInput = userInput;

    if (filteredValue === "correct") {
      questions.forEach((question, index) => {
        if (correct.indexOf(index) !== -1) {
          filteredQuestionIndexes.push(index);
        }
      });
    } else if (filteredValue === "incorrect") {
      questions.forEach((question, index) => {
        if (incorrect.indexOf(index) !== -1) {
          filteredQuestionIndexes.push(index);
        }
      });
    } else {
      filteredQuestionIndexes = Array.from(Array(questions.length).keys());
    }
    return filteredQuestionIndexes.map((questionIndex, i) => {
      const userInputIndexes = userInput[questionIndex];
      const question = questions[questionIndex];
      const answerSelectionType = question.answerSelectionType || "single";
      return (
        <div className="result-answer-wrapper" key={i}>
          <h3
            dangerouslySetInnerHTML={rawMarkup(
              `Q${question.questionIndex}: ${question.question}`
            )}
          />
          {question.questionPic && (
            <img
              src={question.questionPic}
              className="question-pic"
              alt="image"
            />
          )}
          {renderTags(
            answerSelectionType,
            question.correctAnswer.length,
            question.segment
          )}
          <div className="result-answer">
            {renderAnswerInResult(question, userInputIndexes)}
          </div>
          <Explanation question={question} isResultPage={true} />
        </div>
      );
    });
  }, [endQuiz, filteredValue]);

  const renderAnswers = (question) => {
    const { answers, correctAnswer, questionType } = question;
    let { answerSelectionType } = question;
    const onClickAnswer = (index) =>
      checkAnswer(index, correctAnswer, answerSelectionType, {
        userInput,
        currentQuestionIndex,
        continueTillCorrect,
        incorrect,
        correct,
        showInstantFeedback,
        setCorrectAnswer,
        setIncorrectAnswer,
        setCorrect,
        setIncorrect,
        setShowNextQuestionButton,
        setUserInput,
      });

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || "single";

    return answers.map((answer, index) => (
      <Fragment key={index}>
        {
          <button
            // disabled={ buttons[index].disabled || false}
            className={`${
              userInput[currentQuestionIndex] &&
              userInput[currentQuestionIndex].indexOf(index) !== -1
                ? showInstantFeedback
                  ? correctAnswer === `${index + 1}` ||
                    correctAnswer.indexOf(index + 1) !== -1
                    ? "correct"
                    : "incorrect"
                  : "selected"
                : ""
            } answerBtn btn`}
            onClick={() => onClickAnswer(index)}
          >
            {questionType === "text" && <span>{answer}</span>}
            {questionType === "photo" && <img src={answer} alt="image" />}
          </button>
        }
      </Fragment>
    ));
  };

  const renderTags = (answerSelectionType, numberOfSelection, segment) => {
    const {
      singleSelectionTagText,
      multipleSelectionTagText,
      pickNumberOfSelection,
    } = appLocale;

    return (
      <div className="tag-container">
        <span className="number-of-selection">
          {pickNumberOfSelection.replace(
            "<numberOfSelection>",
            numberOfSelection
          )}
        </span>
        {segment && <span className="selection-tag segment">{segment}</span>}
      </div>
    );
  };

  const renderResult = () => (
    <div>
      <a
        style={{ width: "125px" }}
        className="btn btn-primary"
        href={`/course/home/${courseId}`}
      >
        Back to Quiz
      </a>
      <div className="card-body">
        <h2>
          {appLocale.resultPageHeaderText
            .replace("<correctIndexLength>", correct.length)
            .replace("<questionLength>", questions.length)}
        </h2>
        <h2>
          {appLocale.resultPagePoint
            .replace("<correctPoints>", correctPoints)
            .replace("<totalPoints>", totalPoints)}
        </h2>
        {showColorCode && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <span className="correct" style={{ padding: "10px" }}>
              Correct option
            </span>
            <span
              className="incorrect"
              style={{ padding: "10px", marginLeft: "15px" }}
            >
              Incorrect option
            </span>
          </div>
        )}
        <br />
        <QuizResultFilter
          filteredValue={filteredValue}
          handleChange={handleChange}
          appLocale={appLocale}
        />
        {renderQuizResultQuestions()}
      </div>
      <a
        style={{ width: "125px" }}
        className="btn btn-primary"
        href={`/quiz/${quizId}`}
      >
        Retake Quiz
      </a>
    </div>
  );

  const nonAttmeptedQuestionNumbers = Array.from(
    Array(questions.length).keys()
  ).filter((q) => !(correct.includes(q) || incorrect.includes(q)));

  return (
    <div className="questionWrapper">
      <h2>{quizHeader}</h2>
      {!endQuiz && (
        <div className="questionWrapperBody">
          <div className="questionModal">
            <InstantFeedback
              question={question}
              showInstantFeedback={showInstantFeedback}
              correctAnswer={correctAnswer}
              incorrectAnswer={incorrectAnswer}
            />
          </div>
          <h3>
            {appLocale.question} {currentQuestionIndex + 1}:
          </h3>
          <h4
            dangerouslySetInnerHTML={rawMarkup(question && question.question)}
          />
          {question && question.questionPic && (
            <img
              src={question.questionPic}
              className="question-pic"
              alt="image"
            />
          )}
          {question &&
            renderTags(
              answerSelectionTypeState,
              question.correctAnswer.length,
              question.segment
            )}
          <div className="answers-container">
            {question && renderAnswers(question)} {/*, buttons)} */}
          </div>
          {(!showInstantFeedback || showNextQuestionButton) && (
            <div style={{ display: "flex" }}>
              {!showInstantFeedback && (
                <button
                  onClick={() => previousQuestion(currentQuestionIndex)}
                  className="navigationBtn btn"
                  disabled={currentQuestionIndex === 0}
                >
                  {appLocale.previousQuestionBtn}
                </button>
              )}
              {currentQuestionIndex === questions.length - 1 ? (
                <>
                  <button
                    onClick={() => nextQuestion(currentQuestionIndex)}
                    className="navigationBtn btn"
                    disabled={nonAttmeptedQuestionNumbers.length > 0}
                  >
                    {appLocale.finishQuestionBtn}
                  </button>
                  {nonAttmeptedQuestionNumbers.length > 0 && (
                    <span className="horizontal-center warning-message">
                      {appLocale.questionsLeftToAnswer.replace(
                        "<questionNumbers>",
                        nonAttmeptedQuestionNumbers.map((q) => q + 1).join(", ")
                      )}
                    </span>
                  )}
                </>
              ) : (
                <button
                  onClick={() => nextQuestion(currentQuestionIndex)}
                  className="navigationBtn btn"
                >
                  {appLocale.nextQuestionBtn}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {endQuiz &&
        showDefaultResultState &&
        customResultPage === undefined &&
        renderResult()}
      {endQuiz &&
        !showDefaultResultState &&
        customResultPage !== undefined &&
        customResultPage(questionSummary)}
    </div>
  );
};

Core.propTypes = {
  questions: PropTypes.array,
  showDefaultResult: PropTypes.bool,
  onComplete: PropTypes.func,
  customResultPage: PropTypes.func,
  showInstantFeedback: PropTypes.bool,
  continueTillCorrect: PropTypes.bool,
  appLocale: PropTypes.object,
};

export default Core;
