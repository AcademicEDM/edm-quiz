import marked from 'marked';
import dompurify from 'dompurify';

export const rawMarkup = (data) => {
    const sanitizer = dompurify.sanitize;
    let rawMarkup = marked(sanitizer(data));
    return {__html: rawMarkup};
};

export const checkAnswer = (index, correctAnswer, answerSelectionType, {
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
}) => {
    const unselectingCurrent = userInput[currentQuestionIndex] && userInput[currentQuestionIndex].indexOf(index) !== -1;

    if (showInstantFeedback && unselectingCurrent) {
        return;
    }

    const answerNumberStr = `${index+1}`;

    if (answerSelectionType === 'single') {
        if (showInstantFeedback && userInput[currentQuestionIndex] && userInput[currentQuestionIndex].length === 1) {
            return;
        }
        if (unselectingCurrent) {
            userInput[currentQuestionIndex] = [];
        } else {
            userInput[currentQuestionIndex] = [index];
        }
        const incorrectIndex = incorrect.indexOf(currentQuestionIndex);
        const correctIndex = correct.indexOf(currentQuestionIndex);
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
                setShowNextQuestionButton(true)
            }
        }
        setCorrect([...correct]);
        setIncorrect([...incorrect]);
        setUserInput({...userInput});
    } else {

        let maxNumberOfMultipleSelection = correctAnswer.length;

        if (!userInput[currentQuestionIndex]) {
            userInput[currentQuestionIndex] = [];
        }

        const selectedAnswerIndexInUserInputIndex = userInput[currentQuestionIndex].indexOf(index);

        if (unselectingCurrent) {
            userInput[currentQuestionIndex].splice(selectedAnswerIndexInUserInputIndex, 1);
            correct = correct.filter(x => x != currentQuestionIndex);
            setCorrect([...correct]);
            setCorrectAnswer(false);
            incorrect = incorrect.filter(x => x!== currentQuestionIndex);
            setIncorrect([...incorrect]);
            setIncorrectAnswer(false);
            setUserInput({...userInput});
        } else {
            if (userInput[currentQuestionIndex].length < maxNumberOfMultipleSelection) {
                userInput[currentQuestionIndex].push(index);
            } else if (showInstantFeedback) {
                return;
            }
            if (maxNumberOfMultipleSelection === userInput[currentQuestionIndex].length) {
                let correctSelectionCount = 0;
                for (let i = 0; i < userInput[currentQuestionIndex].length; i++) {
                    if (correctAnswer.includes(userInput[currentQuestionIndex][i]+1)) {
                        correctSelectionCount++;
                    }
                }
                if (correctSelectionCount === maxNumberOfMultipleSelection) {
                    correct.push(currentQuestionIndex);
                    setCorrect([...correct]);
                    setCorrectAnswer(true);
                    setIncorrectAnswer(false);
                    setShowNextQuestionButton(true);
                } else {
                    incorrect.push(currentQuestionIndex);
                    setIncorrect([...incorrect]);
                    setIncorrectAnswer(true);
                    setCorrectAnswer(false);
                    setShowNextQuestionButton(true);
                }
            }
            setUserInput({ ...userInput });
        }
    }
};
