window.onload = function() {
    let correctFive = document.getElementById("correctFive")
    correctFive.onclick = function() {
        axios.post('/add-one', {questionFive: "Correct!"}).then().catch() 
    }
}