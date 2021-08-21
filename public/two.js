window.onload = function() {
    let correctTwo = document.getElementById("correctTwo")
    correctTwo.onclick = function() {
        axios.post('/add-one', {questionTwo: "Correct!"}).then().catch()
    }
}