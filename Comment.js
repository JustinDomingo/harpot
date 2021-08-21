const ObjectID = require('mongodb').ObjectID
const commentsCollection = require('./db').db().collection('comments')
const sanitizeHTML = require('sanitize-html')

let commentConstructor = function(comment, username) {
    this.comment = comment
    this.errors = []
    this.username = username
}

commentConstructor.prototype.cleanUp = function() {
    this.data = {
        comment: sanitizeHTML(this.comment.trim(), {allowedTags: [], allowedAttributes: {}}),
        postDate: new Date(),
        author: this.username
    }
}

commentConstructor.prototype.validate = function() {
    if (this.data.comment == "") {this.errors.push("You must provide content.")}
}

commentConstructor.prototype.post = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            commentsCollection.insertOne(this.data)
            resolve(this.data)
        } else {
            reject(this.errors)
        }
    })
    
}

module.exports = commentConstructor