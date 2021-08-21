window.onload = function() {
    let correctThree = document.getElementById("correctThree")
    correctThree.onclick = function() {
        axios.post('/add-one', {questionThree: "Correct!"}).then().catch()
    }
}