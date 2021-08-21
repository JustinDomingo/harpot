window.onload = function() {
    let correctFour = document.getElementById("correctFour")
    correctFour.onclick = function() {
        axios.post('/add-one', {questionFour: "Correct!"}).then().catch()
    }
}