const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hi server is saying hello to you on this endpoint.")
})

app.use((req, res) => {
    res.send("Server is up and running on 7777.")
})

app.listen("7777", () => {
    console.log("Server is listening on port 7777")
});