const answers = [1, 2, 3, 4]

function countCorrectAnswers(name, answers) {
    const correctQuestions = [3, 1, 0, 2]

    if (answers.length === 0) {
        return {
            name,
            answers: [],
            totalCorrectAnswers: 0,
            totalAnswers: 0
        }
    } else {
        const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
            if (answer === correctQuestions[index]) {
                acc++
            }
            return acc
        }, 0)

        const result = {
            name,
            answers,
            totalCorrectAnswers,
            totalAnswers: answers.length
        }

        return result
    }
}
module.exports = {
    countCorrectAnswers
}