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
            setShowNextQuestionButton(true);
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

        if (selectedAnswerIndexInUserInputIndex !== -1) {
            userInput[currentQuestionIndex].splice(selectedAnswerIndexInUserInputIndex, 1);
            const correctIndex = correct.indexOf(index), incorrectIndex = incorrect.indexOf(index);
            if (correctAnswer.includes(answerNumberStr)) {
                if (correctIndex !== -1) {
                    correct.splice(correctIndex, 1);
                }
                setCorrectAnswer(false);
            } else if (incorrectIndex !== -1) {
                incorrect.splice(incorrectIndex, 1);
                setIncorrectAnswer(false);
            }
            setCorrect([...correct]);
            setUserInput({...userInput});
        } else {
            if (userInput[currentQuestionIndex].length < maxNumberOfMultipleSelection) {
                userInput[currentQuestionIndex].push(index);
            } else if (showInstantFeedback) {
                return;
            }

            if (maxNumberOfMultipleSelection === userInput[currentQuestionIndex].length) {
                let cnt = 0;
                for (let i = 0; i < userInput[currentQuestionIndex].length; i++) {
                    if (correctAnswer.includes(userInput[currentQuestionIndex][i]+1)) {
                        cnt++;
                    }
                }

                if (cnt === maxNumberOfMultipleSelection) {
                    correct.push(currentQuestionIndex);

                    setCorrectAnswer(true);
                    setIncorrectAnswer(false);
                    setCorrect([...correct]);
                    setShowNextQuestionButton(true);
                } else {
                    incorrect.push(currentQuestionIndex);

                    setIncorrectAnswer(true);
                    setCorrectAnswer(false);
                    setIncorrect([...incorrect]);
                    setShowNextQuestionButton(true);
                }
            }
            setUserInput({ ...userInput });
        }
    }
};
