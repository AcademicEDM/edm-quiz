"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Core = _interopRequireDefault(require("./Core"));

var _Locale = require("./Locale");

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Quiz = function Quiz(_ref) {
  var quiz = _ref.quiz,
      courseId = _ref.courseId,
      quizId = _ref.quizId,
      shuffle = _ref.shuffle,
      showDefaultResult = _ref.showDefaultResult,
      onComplete = _ref.onComplete,
      customResultPage = _ref.customResultPage,
      showInstantFeedback = _ref.showInstantFeedback,
      continueTillCorrect = _ref.continueTillCorrect,
      showColorCode = _ref.showColorCode;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      start = _useState2[0],
      setStart = _useState2[1];

  var _useState3 = (0, _react.useState)(quiz.questions),
      _useState4 = _slicedToArray(_useState3, 2),
      questions = _useState4[0],
      setQuestions = _useState4[1];

  (0, _react.useEffect)(function () {
    if (shuffle) {
      setQuestions(shuffleQuestions(quiz.questions));
    } else {
      setQuestions(quiz.questions);
    }

    setQuestions(questions.map(function (question, index) {
      return _objectSpread({}, question, {
        questionIndex: index + 1
      });
    }));
  }, [start]);
  var shuffleQuestions = (0, _react.useCallback)(function (questions) {
    for (var i = questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref2 = [questions[j], questions[i]];
      questions[i] = _ref2[0];
      questions[j] = _ref2[1];
    }

    return questions;
  }, []);

  var validateQuiz = function validateQuiz(quiz) {
    if (!quiz) {
      console.error("Quiz object is required.");
      return false;
    }

    var questions = quiz.questions;

    if (!questions) {
      console.error("Field 'questions' is required.");
      return false;
    }

    for (var i = 0; i < questions.length; i++) {
      var _questions$i = questions[i],
          question = _questions$i.question,
          questionType = _questions$i.questionType,
          questionPic = _questions$i.questionPic,
          answerSelectionType = _questions$i.answerSelectionType,
          answers = _questions$i.answers,
          correctAnswer = _questions$i.correctAnswer;

      if (!question) {
        console.error("Field 'question' is required.");
        return false;
      }

      if (!questionType) {
        console.error("Field 'questionType' is required.");
        return false;
      } else {
        if (questionType != 'text' && questionType != 'photo') {
          console.error("The value of 'questionType' is either 'text' or 'photo'.");
          return false;
        }
      }

      if (!answers) {
        console.error("Field 'answers' is required.");
        return false;
      } else {
        if (!Array.isArray(answers)) {
          console.error("Field 'answers' has to be an Array");
          return false;
        }
      }

      if (!correctAnswer) {
        console.error("Field 'correctAnswer' is required.");
        return false;
      }

      if (!answerSelectionType) {
        // Default single to avoid code breaking due to automatic version upgrade
        console.warn("Field answerSelectionType should be defined since v0.3.0. Use single by default.");
        answerSelectionType = answerSelectionType || 'single';
      }

      if (answerSelectionType === 'single' && !(typeof answerSelectionType === 'string' || answerSelectionType instanceof String)) {
        console.error("answerSelectionType is single but expecting String in the field correctAnswer");
        return false;
      }

      if (answerSelectionType === 'multiple' && !Array.isArray(correctAnswer)) {
        console.error("answerSelectionType is multiple but expecting Array in the field correctAnswer");
        return false;
      }
    }

    return true;
  };

  if (!validateQuiz(quiz)) {
    return null;
  }

  var appLocale = _objectSpread({}, _Locale.defaultLocale, quiz.appLocale);

  return _react.default.createElement("div", {
    className: "react-quiz-container"
  }, !start && _react.default.createElement("div", null, _react.default.createElement("h2", {
    style: {
      marginBottom: "10px"
    }
  }, quiz.quizTitle), _react.default.createElement("div", null, appLocale.landingHeaderText.replace("<questionLength>", quiz.questions.length)), !showInstantFeedback && _react.default.createElement("div", null, appLocale.allQuestionsMandatory), quiz.quizSynopsis && _react.default.createElement("div", {
    className: "quiz-synopsis"
  }, quiz.quizSynopsis), _react.default.createElement("div", {
    className: "startQuizWrapper"
  }, _react.default.createElement("button", {
    onClick: function onClick() {
      return setStart(true);
    },
    className: "startQuizBtn btn"
  }, appLocale.startQuizBtn))), start && _react.default.createElement(_Core.default, {
    quizId: quizId,
    courseId: courseId,
    quizHeader: quiz.quizTitle,
    questions: questions,
    showDefaultResult: showDefaultResult,
    onComplete: onComplete,
    customResultPage: customResultPage,
    showInstantFeedback: showInstantFeedback,
    continueTillCorrect: continueTillCorrect,
    showColorCode: showColorCode,
    appLocale: appLocale
  }));
};

Quiz.propTypes = {
  quiz: _propTypes.default.object,
  courseId: _propTypes.default.string,
  shuffle: _propTypes.default.bool,
  showDefaultResult: _propTypes.default.bool,
  onComplete: _propTypes.default.func,
  customResultPage: _propTypes.default.func,
  showInstantFeedback: _propTypes.default.bool,
  continueTillCorrect: _propTypes.default.bool,
  showColorCode: _propTypes.default.bool
};
var _default = Quiz;
exports.default = _default;
