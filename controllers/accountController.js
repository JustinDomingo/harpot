const Account = require('../Account')
const router = require('../router')
var path = require('path')
const { nextTick } = require('process')

exports.submit = function(req, res) {
    if (req.session.user) {
        res.send(`<!DOCTYPE html>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
        <h1 class="heading title-font">The Harry Potter Quiz</h1>
        <a class="sign-out" href="/sign-out">Sign Out</a>
        <h1 class="subtitle">Submit your score!</h1>
        <div id="divChange" class="questions">You got ${req.session.userScore.score} correct!</div>
        <br>
        <form action='/submission' method='GET'>
        <button>Submit!</button>
        </form>
        <script>
        </script>
        <link rel="stylesheet" href="styles.css">`)
    } else {
        res.sendFile(path.resolve('public/home-guest.html'))
    }
    
}

exports.login = function(req, res) {
    let user = new Account(req.body)
    user.login().then((result) => {
        req.session.user = {username: user.accountData.username, _id: user.accountData._id, score: req.session.score}
        req.session.save(function() {
            if (req.session.userScore) {
                res.redirect('/submit-score')
            } else {
                res.redirect('/')
            }
            
        })
    }).catch((error) => {
        let theError = "Invalid Username/Password"
        req.flash('errors', theError)
        req.session.save(function() {
            res.redirect('/submit-score')
        })
    })
}

exports.signOut = async function(req, res) {
    req.session.destroy(function() {
        res.redirect('/redirect')
    })
}

exports.redirect = async function(req, res) {
    res.send(`<!DOCTYPE html>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
    <h1 class="heading title-font">The Harry Potter Quiz</h1>
    
    <div class="subtitle">Create an account</div>
    <form id="formOne" action="/create-account" method="POST">
        <input name="email"></input>
        <div class="questions">Email</div>
        <br>
        <input name="username"></input>
        <div class="questions">Username</div>
        <br>
        <input name="password"></input>
        <div class="questions">Password</div>
        <br>
    <button class="buttons">Create account!</button>
    </form>
    <br>
    <div class="subtitle">Log In!</div>
    <div class="errors">${req.flash('errors')}</div>
    <form id="formTwo" action="/login" method="POST">
        <input name="username"></input>
        <div class="questions">Username</div>
        <br>
        <input name="password"></input>
        <div class="questions">Password</div>
        <br>
    <button class="buttons">Log In!</button>
    </form>
    
    <script src="browser.js">
    </script>
    `)
}

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors', "You must be logged in to post a comment.")
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.register = function(req, res) {
    let account = new Account(req.body)
    account.register().then((data) => {
        req.session.user = {username: account.accountData.username, _id: account.accountData._id}
        req.session.save(function() {
            if (req.session.userScore) {
                res.redirect('/submit-score')
            } else {
                res.redirect('/')
            }
            
            console.log(account.errors)
        })
        console.log(data)
    }).catch((errors) => {
        res.send(`<!DOCTYPE html>
        <link rel="stylesheet" href="styles.css">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
        <h1 class="heading title-font">The Harry Potter Quiz</h1>
        
        <div class="subtitle">Create an account</div>
        <ul>
        ${errors.map(function(item) {
            return `<div class="errors">${item}</li>`
        }).join('')}
        </ul>
        
        <form id="formOne" action="/create-account" method="POST">
            <input name="email"></input>
            <div class="questions">Email</div>
            <br>
            <input name="username"></input>
            <div class="questions">Username</div>
            <br>
            <input name="password"></input>
            <div class="questions">Password</div>
            <br>
        <button class="buttons">Create account!</button>
        </form>
        <br>
        <div class="subtitle">Log In!</div>
        <div class="errors">${req.flash('errors')}</div>
        <form id="formTwo" action="/login" method="POST">
            <input name="username"></input>
            <div class="questions">Username</div>
            <br>
            <input name="password"></input>
            <div class="questions">Password</div>
            <br>
        <button class="buttons">Log In!</button>
        </form>
        
        <script src="browser.js">
        </script>`)
    })
}

exports.home = function(req, res) {
    res.sendFile(path.resolve('public/question-one.html'))
}

exports.submitScore = function(req, res) {
    if (req.session.user) {
        res.send(`
        <!DOCTYPE html>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
        <h1 class="heading title-font">The Harry Potter Quiz</h1>
        <a class="sign-out" href="/sign-out">Sign Out</a>
        <h1 class="subtitle">Submit your score!</h1>
        <div id="divChange" class="questions">You got ${req.session.userScore.score} correct!</div>
        <br>
        <form action='/submission' method='GET'>
        <button>Submit!</button>
        </form>
        <script>
        </script>
        <link rel="stylesheet" href="styles.css">
        `)
    } else {
        res.send(`<!DOCTYPE html>
        <link rel="stylesheet" href="styles.css">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
        <h1 class="heading title-font">The Harry Potter Quiz</h1>
        
        <div class="subtitle">Create an account</div>
        <form id="formOne" action="/create-account" method="POST">
            <input name="email"></input>
            <div class="questions">Email</div>
            <br>
            <input name="username"></input>
            <div class="questions">Username</div>
            <br>
            <input name="password"></input>
            <div class="questions">Password</div>
            <br>
        <button class="buttons">Create account!</button>
        </form>
        <br>
        <div class="subtitle">Log In!</div>
        <div class="errors">${req.flash('errors')}</div>
        <form id="formTwo" action="/login" method="POST">
            <input name="username"></input>
            <div class="questions">Username</div>
            <br>
            <input name="password"></input>
            <div class="questions">Password</div>
            <br>
        <button class="buttons">Log In!</button>
        </form>
        
        <script src="browser.js">
        </script>`)
    }
    
        //res.sendFile(path.resolve('public/home-guest.html'))
}