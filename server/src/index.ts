import express from "express";
import http from "http"
const https = require('https');
const fs = require('fs');

import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression";
import cors from "cors"
import dotenv from 'dotenv'
import mongoose from "mongoose";
import path from "path";

import router from "./router";

const app = express();

dotenv.config();
app.use(cors(
    {
        credentials: true
    }
))
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

// const privateKey = fs.readFileSync('server.key', 'utf8');
// const certificate = fs.readFileSync('server.cert', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
const server = http.createServer(app)
// const httpsServer = https.createServer(credentials, app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/")
})
// httpsServer.listen(8080, () => {
//     console.log("Server running on https://localhost:8080/")
// })

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.on("error", (error: Error) => {
    console.log(error)
})

app.use("/api", router())

app.use("/", express.static(path.join(__dirname, "../..", "dist")))
app.use((req, res) => {
    res.redirect("/")
})
// app.use("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../..", "dist", "index.html"))
// })