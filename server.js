const express = require("express");
const app = require('./app')

const server = express();
const PORT = process.env.PORT || 65451

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static('static', { maxAge: '1y' }));
server.use((req, res, next) => app(req, res, next));
server.listen(PORT, async () => {
    console.log(`Started app at: http://localhost:${PORT}`)  
})