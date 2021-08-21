let commentsForm = document.getElementById("commentsForm")
let commentsList = document.getElementById("commentsList")

function itemTemplate(text) {
    return `<div class="questions">${text.author + ": " + text.comment} <button data-id="${text._id}" data-username="${text.author}" class="delete-button">Delete</button></div>`
}

//Client-side rendering
let theHTML = comments.map(function(item) {
    return `<div class="questions">${item.author + ": " + item.comment} <button data-id="${item._id}" data-username="${item.author}" class="delete-button">Delete</button></div>`
}).join('')
commentsList.insertAdjacentHTML("beforeend", theHTML)

//Creating comment
commentsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let commentsInput = document.getElementById("commentsInput").value
    axios.post('/comment', {text: commentsInput}).then((response) => {
        commentsList.insertAdjacentHTML("beforeend", itemTemplate(response.data))
    }).catch((err) => {
        console.log(err)
    })
})

//Deleting comment
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        axios.post('/delete-comment', {_id: e.target.getAttribute("data-id"), username: e.target.getAttribute("data-username")}).then(function(response) {
            if (response.data) {
                e.target.parentElement.remove()
            } else {
                alert("You can only delete your own comment.")
            }
        }).catch(function() {
            console.log("Error")
        })
    }
})