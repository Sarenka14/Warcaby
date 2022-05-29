var express = require("express")
var app = express()
const PORT = process.env.PORT;
var path = require("path")

app.use(express.static('static'))
app.use(express.text())

let players = []
let oldPosition = []
let newPosition = []
let kolej

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.post("/", function (req, res) {
    userLogin = req.body
    if (players.length == 0) {
        players.push(userLogin)
        let color = "white"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length == 1 && players[0] != userLogin) {
        players.push(userLogin)
        let color = "black"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length >= 2) {
        const color = "no color"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else {
        const jsonBack = { color: "login powtórzony", login: "login powtórzony" }
        res.end(JSON.stringify(jsonBack))
    }

})

app.post("/checkLogin", function (req, res) {
    if (players.length == 2) {
        //2 players in
        const jsonBack = { users: 2 }
        res.end(JSON.stringify(jsonBack))
    } else if (players.length == 1) {
        //display waiting
        const jsonBack = { users: 1 }
        res.end(JSON.stringify(jsonBack))
    } else {
        const jsonBack = { users: 0 }
        res.end(JSON.stringify(jsonBack))
    }
})

app.post("/reset", function (req, res) {
    players = []
    oldPosition = []
    newPosition = []
})

app.post("/ruch", function (req, res) {
    req.body = JSON.parse(req.body)
    oldPosition = req.body.staraPozycja
    newPosition = req.body.nowaPozycja
    res.send()
})

app.post("/zmianaPoRuchu", function (req, res) {
    res.send(JSON.stringify({ oldPosition, newPosition }))
})