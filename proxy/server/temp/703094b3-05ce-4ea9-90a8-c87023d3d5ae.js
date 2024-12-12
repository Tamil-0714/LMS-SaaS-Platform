// Write your JavaScript code here

const http = require("http");

const server = http.createServer((req,res) => {
    res.send("nice");
})

server.listen(3000);