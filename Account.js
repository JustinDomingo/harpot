const usersCollection = require('./db').db().collection('users')

function userConstructor(data) {
    this.accountData = data
    this.errors = []
}

userConstructor.prototype.cleanUp = function() {
    this.accountData = {
        email: this.accountData.email,
        username: this.accountData.username,
        password: this.accountData.password,
        score: 0
    }
}

userConstructor.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.accountData.username == "") {this.errors.push("You must provide a valid username.")}
        if (this.accountData.email == "") {this.errors.push("You must provide a valid email.")}
        if (this.accountData.password == "") {this.errors.push("You must provide a valid password.")}
        if (this.accountData.username.length < 3) {this.errors.push("That username is too short.")}
        if (this.accountData.username.length > 30) {this.errors.push("That username is too long.")}
        if (this.accountData.password.length < 10) {this.errors.push("That password is too short.")}
        if (this.accountData.password.length > 50) {this.errors.push("That password is too long.")}
        if (this.accountData.username.length > 3 && this.accountData.username.length < 31) {
            let usernameExists = await usersCollection.findOne({username: this.accountData.username})
            if (usernameExists) {this.errors.push("That username is already taken.")}
         }
    })
}


userConstructor.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            await usersCollection.insertOne(this.accountData)
            resolve(this.accountData)
        } else {
            reject(this.errors)
            console.log("Failed")
        }
    })
}

userConstructor.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.accountData.username}).then((attemptedLogin) => {
            if (attemptedLogin && attemptedLogin.password == this.accountData.password) {
                this.accountData = attemptedLogin
                resolve(attemptedLogin)
            } else {
                reject()
            }
        })
    })   
}

userConstructor.logout = function() {
    return new Promise((resolve, reject) => {
        resolve("Success")
    })
}

module.exports = userConstructor