import express from "express";
import bodyparser from "body-parser";
import { register, login, refresh, invalidate } from "./api"

const { PORT, BIND_ADDRESS } = process.env

const app = express();
app.use(bodyparser.json())
app.post("/register", register)
app.post("/login", login)
app.post("/refresh", refresh)
app.get("/invalidate", invalidate)

const port = parseInt(PORT!)
if (isNaN(port)) throw new Error("PORT expected to be an integer")
console.log(`Starting server on ${BIND_ADDRESS}:${port}`)
app.listen(port, BIND_ADDRESS!, 10000)
