import express from "express";
import { config } from "dotenv-safe"
import bodyparser from "body-parser";
import { wrapAPI } from "./util/api"
import { register, login, refresh, invalidate } from "./api"

config()

const app = express();
app.use(bodyparser.json())
app.post("/register", register)
app.post("/login", login)
app.get("/refresh", wrapAPI(refresh))
app.post("/invalidate", wrapAPI(invalidate))
