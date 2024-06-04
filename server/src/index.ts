import express from "express";
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression";
import cors from "cors"
import dotenv from 'dotenv'
import mongoose from "mongoose";
import path from "path";

// for development
// import ngrok from "@ngrok/ngrok"
// -------------

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

const server = http.createServer(app)

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT)
})
// for development
// ngrok.connect({ addr: PORT, authtoken_from_env: true })
// 	.then(listener => console.log(`Ingress established at: ${listener.url()}`));
// -------------


mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.on("error", (error: Error) => {
    console.log(error)
})

app.use("/api", router())

app.use(express.static(path.join(__dirname, "../", "public")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public", "index.html"))
})
// app.use((req, res) => {
//     res.redirect("/")
// })
// app.use("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../..", "dist", "index.html"))
// })