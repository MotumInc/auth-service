import express from "express";
import { config } from "dotenv-safe"
import bodyparser from "body-parser";
import { register, login, refresh, invalidate } from "./api"
import { connect } from "./util/user-registry";

config()
connect()

const { PORT, HOSTNAME } = process.env

const app = express();
app.use(bodyparser.json())
app.post("/register", register)
app.post("/login", login)
app.post("/refresh", refresh)
app.get("/invalidate", invalidate)

const port = parseInt(PORT!)
if (isNaN(port)) throw new Error("PORT expected to be an integer")
console.log(`Starting server on ${HOSTNAME}:${port}`)
app.listen(port, HOSTNAME!, 10000)
