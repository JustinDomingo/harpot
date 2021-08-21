const express = require('express')
const router = express.Router()
const accountController = require('./controllers/accountController')
const questionsController = require('./controllers/questionsController')
const commentController = require('./controllers/commentController')
const ObjectID = require('mongodb').ObjectID
const usersCollection = require('./db').db().collection('users')
const commentsCollection = require('./db').db().collection('comments')
let numberCorrect = []

router.use(express.static('public'))

router.get('/', accountController.home)
router.get('/submit-score', accountController.submitScore)


router.post('/login', accountController.login)
router.get('/sign-out', function(req, res, next) {
    numberCorrect = []
    next()
}, accountController.signOut)
router.post('/create-account', accountController.register)
router.post('/q1', questionsController.questionOne)
router.post('/q2', questionsController.questionTwo)
router.post('/q3', questionsController.questionThree)
router.post('/q4', questionsController.questionFour)
router.post('/results', function(req, res) {
    req.session.userScore = {score: numberCorrect.length}
    req.session.save(function() {
        res.send(`
    <!DOCTYPE html>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
    <center>
    <h1 class="heading title-font">The Harry Potter Quiz</h1>
    <h1 class="questions">You got ${numberCorrect.length} out of 5 correct!</h1>

    <form action='/submit' method="POST">
    <button class="buttons">Submit your score!</button>
    </form>
    </center>

    <script src="browser.js"></script>
    `)
    })
})

router.post('/comment', accountController.mustBeLoggedIn, commentController.postComment)

router.post('/add-one', function(req, res) {
    numberCorrect.push(req.body)
})

router.post('/submit', accountController.submit)
router.get('/redirect', accountController.redirect)
router.get('/submission', accountController.mustBeLoggedIn, async function(req, res) {
    //Pushes all items in the current comment collection into the "commentsArray"
    let commentsArray = await commentsCollection.find().toArray()
    console.log(numberCorrect.length)
    //Sets the score field of a user to the amount of correct questions
        await usersCollection.findOneAndUpdate({_id: new ObjectID(req.session.user._id)}, {$set: {score: numberCorrect.length}}, function() {
            console.log(req.session.user.username)
            usersCollection.find().toArray(function(err, items) {
                //Sorts in greatest to least order
                items.sort(function(a, b) {
                    return b.score - a.score
                })
                res.send(`
                <!DOCTYPE html>
                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
                <h1 class="heading title-font">The Harry Potter Quiz</h1>
                <h1 class="subtitle">Submitted!</h1>
            <br>
            <h3 class="subtitle">Leaders</h3>
            <ol>
                ${items.map(function(user) {
                    return `<hr> <li class="questions">${user.username + " " + user.score}</li>`
                }).join('')}
            </ol>
                
            <h3 class="subtitle">Comments</h3>
            <form id='commentsForm' action='/comment' method='POST'>
            <input name="comment" id='commentsInput'></input> <button>Enter</button>
            </form>
            <ul id="commentsList">   
                
            </ul>
    
            <a class="sign-out" href="/sign-out">Sign Out</a>
    
            <script>
            let comments = ${JSON.stringify(commentsArray)}
            let author = ${JSON.stringify(req.session.user._id)}
            </script>
    
            <link rel="stylesheet" href="styles.css">
            <script src="comments.js"></script>
            <script src="https://unpkg.com/axios/dist/axios.min.js"></script>`)
            })
        })
        numberCorrect = []
})

router.post('/delete-comment', commentController.deleteComment)

module.exports = router