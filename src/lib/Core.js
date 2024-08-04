"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _QuizResultFilter = _interopRequireDefault(require("./core-components/QuizResultFilter"));

var _helpers = require("./core-components/helpers");

var _InstantFeedback = _interopRequireDefault(require("./core-components/InstantFeedback"));

var _Explanation = _interopRequireDefault(require("./core-components/Explanation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Core = function Core(_ref) {
  var quizId = _ref.quizId,
      courseId = _ref.courseId,
      quizHeader = _ref.quizHeader,
      questions = _ref.questions,
      appLocale = _ref.appLocale,
      showDefaultResult = _ref.showDefaultResult,
      onComplete = _ref.onComplete,
      customResultPage = _ref.customResultPage,
      showInstantFeedback = _ref.showInstantFeedback,
      continueTillCorrect = _ref.continueTillCorrect,
      showColorCode = _ref.showColorCode;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      incorrectAnswer = _useState2[0],
      setIncorrectAnswer = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      correctAnswer = _useState4[0],
      setCorrectAnswer = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      showNextQuestionButton = _useState6[0],
      setShowNextQuestionButton = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      endQuiz = _useState8[0],
      setEndQuiz = _useState8[1];

  var _useState9 = (0, _react.useState)(0),
      _useState10 = _slicedToArray(_useState9, 2),
      currentQuestionIndex = _useState10[0],
      setCurrentQuestionIndex = _useState10[1];

  var _useState11 = (0, _react.useState)([]),
      _useState12 = _slicedToArray(_useState11, 2),
      correct = _useState12[0],
      setCorrect = _useState12[1];

  var _useState13 = (0, _react.useState)([]),
      _useState14 = _slicedToArray(_useState13, 2),
      incorrect = _useState14[0],
      setIncorrect = _useState14[1];

  var _useState15 = (0, _react.useState)({}),
      _useState16 = _slicedToArray(_useState15, 2),
      userInput = _useState16[0],
      setUserInput = _useState16[1];

  var _useState17 = (0, _react.useState)("all"),
      _useState18 = _slicedToArray(_useState17, 2),
      filteredValue = _useState18[0],
      setFilteredValue = _useState18[1];

  var _useState19 = (0, _react.useState)(true),
      _useState20 = _slicedToArray(_useState19, 2),
      showDefaultResultState = _useState20[0],
      setShowDefaultResult = _useState20[1];

  var _useState21 = (0, _react.useState)(undefined),
      _useState22 = _slicedToArray(_useState21, 2),
      answerSelectionTypeState = _useState22[0],
      setAnswerSelectionType = _useState22[1];

  var _useState23 = (0, _react.useState)(0),
      _useState24 = _slicedToArray(_useState23, 2),
      totalPoints = _useState24[0],
      setTotalPoints = _useState24[1];

  var _useState25 = (0, _react.useState)(0),
      _useState26 = _slicedToArray(_useState25, 2),
      correctPoints = _useState26[0],
      setCorrectPoints = _useState26[1];

  var _useState27 = (0, _react.useState)(questions[currentQuestionIndex]),
      _useState28 = _slicedToArray(_useState27, 2),
      question = _useState28[0],
      setQuestion = _useState28[1];

  var _useState29 = (0, _react.useState)(undefined),
      _useState30 = _slicedToArray(_useState29, 2),
      questionSummary = _useState30[0],
      setQuestionSummary = _useState30[1];

  (0, _react.useEffect)(function () {
    setShowDefaultResult(showDefaultResult !== undefined ? showDefaultResult : true);
  }, [showDefaultResult]);
  (0, _react.useEffect)(function () {
    setQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);
  (0, _react.useEffect)(function () {
    var answerSelectionType = question.answerSelectionType; // Default single to avoid code breaking due to automatic version upgrade

    setAnswerSelectionType(answerSelectionType || "single");
  }, [question, currentQuestionIndex]);
  (0, _react.useEffect)(function () {
    if (endQuiz) {
      var totalPointsTemp = 0;
      var correctPointsTemp = 0;

      for (var i = 0; i < questions.length; i++) {
        var point = questions[i].point || 0;

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
  (0, _react.useEffect)(function () {
    setQuestionSummary({
      numberOfQuestions: questions.length,
      numberOfCorrectAnswers: correct.length,
      numberOfIncorrectAnswers: incorrect.length,
      questions: questions,
      userInput: userInput,
      totalPoints: totalPoints,
      correctPoints: correctPoints
    });
  }, [totalPoints, correctPoints]);
  (0, _react.useEffect)(function () {
    if (endQuiz && onComplete !== undefined && questionSummary !== undefined) {
      onComplete(questionSummary);
    }
  }, [endQuiz, questionSummary]);

  var previousQuestion = function previousQuestion(currentQuestionIndex) {
    if (currentQuestionIndex - 1 >= 0) {
      setIncorrectAnswer(false);
      setCorrectAnswer(false);
      setShowNextQuestionButton(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  var nextQuestion = function nextQuestion(currentQuestionIndex) {
    setIncorrectAnswer(false);
    setCorrectAnswer(false);
    setShowNextQuestionButton(false);

    if (currentQuestionIndex + 1 === questions.length) {
      setEndQuiz(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  var handleChange = function handleChange(event) {
    setFilteredValue(event.target.value);
  };

  var renderAnswerInResult = function renderAnswerInResult(question, userInputIndexes) {
    var answers = question.answers,
        correctAnswer = question.correctAnswer,
        questionType = question.questionType;
    var answerSelectionType = question.answerSelectionType;
    var answerBtnCorrectClassName;
    var answerBtnIncorrectClassName; // Default single to avoid code breaking due to automatic version upgrade

    answerSelectionType = answerSelectionType || "single";
    return answers.map(function (answer, index) {
      if (answerSelectionType === "single") {
        // correctAnswer - is string
        answerBtnCorrectClassName = "".concat(index + 1) === correctAnswer ? "correct" : "";
        answerBtnIncorrectClassName = "".concat(index + 1) !== correctAnswer && userInputIndexes.includes(index) ? "incorrect" : "";
      } else {
        // correctAnswer - is array of numbers
        answerBtnCorrectClassName = correctAnswer.includes(index + 1) ? "correct" : "";
        answerBtnIncorrectClassName = !correctAnswer.includes(index + 1) && userInputIndexes.includes(index) ? "incorrect" : "";
      }

      return _react.default.createElement("button", {
        disabled: true,
        key: index,
        className: "answerBtn btn " + answerBtnCorrectClassName + answerBtnIncorrectClassName
      }, questionType === "text" && _react.default.createElement("span", null, answer), questionType === "photo" && _react.default.createElement("img", {
        src: answer,
        alt: "image"
      }));
    });
  };

  var renderQuizResultQuestions = (0, _react.useCallback)(function () {
    var filteredQuestionIndexes = []; // let filteredUserInput = userInput;

    if (filteredValue === "correct") {
      questions.forEach(function (question, index) {
        if (correct.indexOf(index) !== -1) {
          filteredQuestionIndexes.push(index);
        }
      });
    } else if (filteredValue === "incorrect") {
      questions.forEach(function (question, index) {
        if (incorrect.indexOf(index) !== -1) {
          filteredQuestionIndexes.push(index);
        }
      });
    } else {
      filteredQuestionIndexes = Array.from(Array(questions.length).keys());
    }

    return filteredQuestionIndexes.map(function (questionIndex, i) {
      var userInputIndexes = userInput[questionIndex];
      var question = questions[questionIndex];
      var answerSelectionType = question.answerSelectionType || "single";
      return _react.default.createElement("div", {
        className: "result-answer-wrapper",
        key: i
      }, _react.default.createElement("h3", {
        dangerouslySetInnerHTML: (0, _helpers.rawMarkup)("Q".concat(question.questionIndex, ": ").concat(question.question))
      }), question.questionPic && _react.default.createElement("img", {
        src: question.questionPic,
        className: "question-pic",
        alt: "image"
      }), renderTags(answerSelectionType, question.correctAnswer.length, question.segment), _react.default.createElement("div", {
        className: "result-answer"
      }, renderAnswerInResult(question, userInputIndexes)), _react.default.createElement(_Explanation.default, {
        question: question,
        isResultPage: true
      }));
    });
  }, [endQuiz, filteredValue]);

  var renderAnswers = function renderAnswers(question) {
    var answers = question.answers,
        correctAnswer = question.correctAnswer,
        questionType = question.questionType;
    var answerSelectionType = question.answerSelectionType;

    var onClickAnswer = function onClickAnswer(index) {
      return (0, _helpers.checkAnswer)(index, correctAnswer, answerSelectionType, {
        userInput: userInput,
        currentQuestionIndex: currentQuestionIndex,
        continueTillCorrect: continueTillCorrect,
        incorrect: incorrect,
        correct: correct,
        showInstantFeedback: showInstantFeedback,
        setCorrectAnswer: setCorrectAnswer,
        setIncorrectAnswer: setIncorrectAnswer,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setShowNextQuestionButton: setShowNextQuestionButton,
        setUserInput: setUserInput
      });
    }; // Default single to avoid code breaking due to automatic version upgrade


    answerSelectionType = answerSelectionType || "single";
    return answers.map(function (answer, index) {
      return _react.default.createElement(_react.Fragment, {
        key: index
      }, _react.default.createElement("button", {
        // disabled={ buttons[index].disabled || false}
        className: "".concat(userInput[currentQuestionIndex] && userInput[currentQuestionIndex].indexOf(index) !== -1 ? showInstantFeedback ? correctAnswer === "".concat(index + 1) || correctAnswer.indexOf(index + 1) !== -1 ? "correct" : "incorrect" : "selected" : "", " answerBtn btn"),
        onClick: function onClick() {
          return onClickAnswer(index);
        }
      }, questionType === "text" && _react.default.createElement("span", null, answer), questionType === "photo" && _react.default.createElement("img", {
        src: answer,
        alt: "image"
      })));
    });
  };

  var renderTags = function renderTags(answerSelectionType, numberOfSelection, segment) {
    var singleSelectionTagText = appLocale.singleSelectionTagText,
        multipleSelectionTagText = appLocale.multipleSelectionTagText,
        pickNumberOfSelection = appLocale.pickNumberOfSelection; // const num_to_word_mapping=new Map(
    //   [
    //     [1,"one"],
    //     [2,"two"],
    //     [3,"three"],
    //     [4,"four"]
    //   ]
    // );

    return _react.default.createElement("div", {
      className: "tag-container"
    }, _react.default.createElement("span", {
      className: "number-of-selection"
    }, pickNumberOfSelection.replace("<numberOfSelection>", numberOfSelection)), segment && _react.default.createElement("span", {
      className: "selection-tag segment"
    }, segment));
  };

  var renderResult = function renderResult() {
    return _react.default.createElement("div", null, _react.default.createElement("a", {
      style: {
        width: "125px"
      },
      className: "btn btn-primary",
      href: "/course/home/".concat(courseId)
    }, "Back to Quiz"), _react.default.createElement("div", {
      className: "card-body"
    }, _react.default.createElement("h2", null, appLocale.resultPageHeaderText.replace("<correctIndexLength>", correct.length).replace("<questionLength>", questions.length)), _react.default.createElement("h2", null, appLocale.resultPagePoint.replace("<correctPoints>", correctPoints).replace("<totalPoints>", totalPoints)), showColorCode && _react.default.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center"
      }
    }, _react.default.createElement("span", {
      className: "correct",
      style: {
        padding: "10px"
      }
    }, "Correct option"), _react.default.createElement("span", {
      className: "incorrect",
      style: {
        padding: "10px",
        marginLeft: "15px"
      }
    }, "Incorrect option")), _react.default.createElement("br", null), _react.default.createElement(_QuizResultFilter.default, {
      filteredValue: filteredValue,
      handleChange: handleChange,
      appLocale: appLocale
    }), renderQuizResultQuestions()), _react.default.createElement("a", {
      style: {
        width: "125px"
      },
      className: "btn btn-primary",
      href: "/quiz/".concat(quizId)
    }, "Retake Quiz"));
  };

  var nonAttmeptedQuestionNumbers = Array.from(Array(questions.length).keys()).filter(function (q) {
    return !(correct.includes(q) || incorrect.includes(q));
  });
  return _react.default.createElement("div", {
    className: "questionWrapper"
  }, _react.default.createElement("h2", null, quizHeader), !endQuiz && _react.default.createElement("div", {
    className: "questionWrapperBody"
  }, _react.default.createElement("div", {
    className: "questionModal"
  }, _react.default.createElement(_InstantFeedback.default, {
    question: question,
    showInstantFeedback: showInstantFeedback,
    correctAnswer: correctAnswer,
    incorrectAnswer: incorrectAnswer
  })), _react.default.createElement("h3", null, appLocale.question, " ", currentQuestionIndex + 1, ":"), _react.default.createElement("h4", {
    dangerouslySetInnerHTML: (0, _helpers.rawMarkup)(question && question.question)
  }), question && question.questionPic && _react.default.createElement("img", {
    src: question.questionPic,
    className: "question-pic",
    alt: "image"
  }), question && renderTags(answerSelectionTypeState, question.correctAnswer.length, question.segment), _react.default.createElement("div", {
    className: "answers-container"
  }, question && renderAnswers(question), " "), (!showInstantFeedback || showNextQuestionButton) && _react.default.createElement("div", {
    style: {
      display: "flex"
    }
  }, !showInstantFeedback && _react.default.createElement("button", {
    onClick: function onClick() {
      return previousQuestion(currentQuestionIndex);
    },
    className: "navigationBtn btn",
    disabled: currentQuestionIndex === 0
  }, appLocale.previousQuestionBtn), currentQuestionIndex === questions.length - 1 ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("button", {
    onClick: function onClick() {
      return nextQuestion(currentQuestionIndex);
    },
    className: "navigationBtn btn",
    disabled: nonAttmeptedQuestionNumbers.length > 0
  }, appLocale.finishQuestionBtn), nonAttmeptedQuestionNumbers.length > 0 && _react.default.createElement("span", {
    className: "horizontal-center warning-message"
  }, appLocale.questionsLeftToAnswer.replace("<questionNumbers>", nonAttmeptedQuestionNumbers.map(function (q) {
    return q + 1;
  }).join(", ")))) : _react.default.createElement("button", {
    onClick: function onClick() {
      return nextQuestion(currentQuestionIndex);
    },
    className: "navigationBtn btn"
  }, appLocale.nextQuestionBtn))), endQuiz && showDefaultResultState && customResultPage === undefined && renderResult(), endQuiz && !showDefaultResultState && customResultPage !== undefined && customResultPage(questionSummary));
};

Core.propTypes = {
  questions: _propTypes.default.array,
  showDefaultResult: _propTypes.default.bool,
  onComplete: _propTypes.default.func,
  customResultPage: _propTypes.default.func,
  showInstantFeedback: _propTypes.default.bool,
  continueTillCorrect: _propTypes.default.bool,
  appLocale: _propTypes.default.object
};
var _default = Core;
exports.default = _default;
