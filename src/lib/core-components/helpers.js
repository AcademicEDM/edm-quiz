"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAnswer = exports.rawMarkup = void 0;

var _marked = _interopRequireDefault(require("marked"));

var _dompurify = _interopRequireDefault(require("dompurify"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

var rawMarkup = function rawMarkup(data) {
  var sanitizer = _dompurify.default.sanitize;
  var rawMarkup = (0, _marked.default)(sanitizer(data));
  return {
    __html: rawMarkup
  };
};

exports.rawMarkup = rawMarkup;

var checkAnswer = function checkAnswer(index, correctAnswer, answerSelectionType, _ref) {
  var userInput = _ref.userInput,
      currentQuestionIndex = _ref.currentQuestionIndex,
      continueTillCorrect = _ref.continueTillCorrect,
      incorrect = _ref.incorrect,
      correct = _ref.correct,
      showInstantFeedback = _ref.showInstantFeedback,
      setCorrectAnswer = _ref.setCorrectAnswer,
      setIncorrectAnswer = _ref.setIncorrectAnswer,
      setCorrect = _ref.setCorrect,
      setIncorrect = _ref.setIncorrect,
      setShowNextQuestionButton = _ref.setShowNextQuestionButton,
      setUserInput = _ref.setUserInput;
  var unselectingCurrent = userInput[currentQuestionIndex] && userInput[currentQuestionIndex].indexOf(index) !== -1;

  if (showInstantFeedback && unselectingCurrent) {
    return;
  }

  var answerNumberStr = "".concat(index + 1);

  if (answerSelectionType === 'single') {
    if (showInstantFeedback && userInput[currentQuestionIndex] && userInput[currentQuestionIndex].length === 1) {
      return;
    }

    if (unselectingCurrent) {
      userInput[currentQuestionIndex] = [];
    } else {
      userInput[currentQuestionIndex] = [index];
    }

    var incorrectIndex = incorrect.indexOf(currentQuestionIndex);
    var correctIndex = correct.indexOf(currentQuestionIndex);

    if (incorrectIndex >= 0) {
      incorrect.splice(incorrectIndex, 1);
    }

    if (correctIndex >= 0) {
      correct.splice(correctIndex, 1);
    }

    if (unselectingCurrent) {
      setCorrectAnswer(false);
      setIncorrectAnswer(false);
    } else if (answerNumberStr === correctAnswer) {
      correct.push(currentQuestionIndex);
      setCorrectAnswer(true);
      setIncorrectAnswer(false);
      setShowNextQuestionButton(true);
    } else {
      incorrect.push(currentQuestionIndex);
      setCorrectAnswer(false);
      setIncorrectAnswer(true);

      if (!continueTillCorrect) {
        setShowNextQuestionButton(true);
      }
    }

    setCorrect(_toConsumableArray(correct));
    setIncorrect(_toConsumableArray(incorrect));
    setUserInput(_objectSpread({}, userInput));
  } else {
    var maxNumberOfMultipleSelection = correctAnswer.length;

    if (!userInput[currentQuestionIndex]) {
      userInput[currentQuestionIndex] = [];
    }

    var selectedAnswerIndexInUserInputIndex = userInput[currentQuestionIndex].indexOf(index);

    if (unselectingCurrent) {
      userInput[currentQuestionIndex].splice(selectedAnswerIndexInUserInputIndex, 1);
      correct = correct.filter(function (x) {
        return x != currentQuestionIndex;
      });
      setCorrect(_toConsumableArray(correct));
      setCorrectAnswer(false);
      incorrect = incorrect.filter(function (x) {
        return x !== currentQuestionIndex;
      });
      setIncorrect(_toConsumableArray(incorrect));
      setIncorrectAnswer(false);
      setUserInput(_objectSpread({}, userInput));
    } else {
      if (userInput[currentQuestionIndex].length < maxNumberOfMultipleSelection) {
        userInput[currentQuestionIndex].push(index);
      } else if (showInstantFeedback) {
        return;
      }

      if (maxNumberOfMultipleSelection === userInput[currentQuestionIndex].length) {
        var correctSelectionCount = 0;

        for (var i = 0; i < userInput[currentQuestionIndex].length; i++) {
          if (correctAnswer.includes(userInput[currentQuestionIndex][i] + 1)) {
            correctSelectionCount++;
          }
        }

        if (correctSelectionCount === maxNumberOfMultipleSelection) {
          correct.push(currentQuestionIndex);
          setCorrect(_toConsumableArray(correct));
          setCorrectAnswer(true);
          setIncorrectAnswer(false);
          setShowNextQuestionButton(true);
        } else {
          incorrect.push(currentQuestionIndex);
          setIncorrect(_toConsumableArray(incorrect));
          setIncorrectAnswer(true);
          setCorrectAnswer(false);
          setShowNextQuestionButton(true);
        }
      }

      setUserInput(_objectSpread({}, userInput));
    }
  }
};

exports.checkAnswer = checkAnswer;