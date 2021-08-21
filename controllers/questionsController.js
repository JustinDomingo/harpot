var path = require('path')

exports.questionOne = function(req, res) {
    res.sendFile(path.resolve('public/question-two.html'))
}

exports.questionTwo = function(req, res) {
    res.sendFile(path.resolve('public/question-three.html'))
}

exports.questionThree = function(req, res) {
    res.sendFile(path.resolve('public/question-four.html'))
}

exports.questionFour = function(req, res) {
    res.sendFile(path.resolve('public/question-five.html'))
}