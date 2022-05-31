//import Game from "./Game"

let playerWhiteLoggedIn = false
let playerBlackLoggedIn = false
let renderWhite = false
let renderBlack = false
let intervalDone = false
let waitForBlack = false

document.getElementById("loginBtn").onclick = function () {
    const login = document.getElementById("loginInput").value
    console.log(login)
    if (login != "") {
        const body = login

        fetch("/", { method: "post", body })
            .then(response => response.json())
            .then(
                data => {
                    if (data.color == "white") {
                        document.getElementById("statusBar").innerHTML = ""
                        document.getElementById("statusBar").innerHTML += `<h2>USER_ADDED<h2><p>Witaj <span style="color:white;">${login}</span>, grasz białymi.</p>`
                        document.getElementById("userLogin").style.display = "none";
                        playerWhiteLoggedIn = true
                        function checkplayers() {
                            fetch("/checklogin", { method: "post", "": "" }).then(
                                response => response.json()
                            ).then(
                                data => {
                                    if (data.users == 1) {
                                        document.getElementById("status").style.display = "block";
                                        document.getElementById("bg").style.display = "block";
                                    }
                                    if (data.users == 2) {
                                        document.getElementById("status").style.display = "none";
                                        document.getElementById("bg").style.display = "none";
                                        waitForBlack = true

                                    }
                                }
                            )
                        } setInterval(checkplayers, 500)
                    }
                    if (data.color == "black") {
                        document.getElementById("statusBar").innerHTML = ""
                        document.getElementById("statusBar").innerHTML += `<h2>USER_ADDED<h2><p>Witaj <span style="color:white;">${login}</span>, grasz czerwonymi.</p>`
                        document.getElementById("userLogin").style.display = "none";
                        document.getElementById("bg").style.display = "none";
                        document.getElementById("kolejBg").style.display = "block";

                        

                        playerBlackLoggedIn = true
                    }
                    if (data.color == "no color") {
                        document.getElementById("statusBar").innerHTML = ""
                        document.getElementById("statusBar").innerHTML += `<h2>ERROR<h2><br><p>Brak wolnych miejsc do gry.</p>`
                    }
                    if (data.color == "login powtórzony") {
                        document.getElementById("statusBar").innerHTML = ""
                        document.getElementById("statusBar").innerHTML += `<h2>ERROR<h2><br><p>Login powtórzony.</p>`
                    }
                }
            )
    }
}

document.getElementById("resetBtn").onclick = function () {
    let body = {}
    fetch("/reset", { method: "post", body })
}
