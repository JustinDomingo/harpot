window.onload = function() {
    let correctOne = document.getElementById("correctOne")
    correctOne.onclick = function() {
        axios.post('/add-one', {questionOne: "Correct!"}).then().catch()
    }
}