import express from "express";
import { config } from "dotenv-safe"
import bodyparser from "body-parser";
import { register, login, refresh, invalidate } from "./api"

config()

const app = express();
app.use(bodyparser.json())
app.post("/register", register)
app.post("/login", login)
app.get("/refresh", refresh)
app.post("/invalidate", invalidate)
