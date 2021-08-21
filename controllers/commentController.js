const Comment = require('../Comment')
const commentsCollection = require('../db').db().collection('comments')
const { ObjectID } = require('bson')

exports.postComment = function(req, res) {
    let comment = new Comment(req.body.text, req.session.user.username)
    comment.post().then(function(data) {
        console.log(data)
        res.json(data)
    }).catch(function(err) {
        res.send("Failed")
        console.log(err)
    })
}

exports.deleteComment = function(req, res) {
    if (req.session.user.username == req.body.username) {
    commentsCollection.deleteOne({_id: new ObjectID(req.body._id)}, function() {
        res.json(true)
    })
    } else {
        res.json(false)
    }
}