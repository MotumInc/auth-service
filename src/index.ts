import express from "express";
import bodyparser from "body-parser";
import { PrismaClient } from "@prisma/client"
import { register, login, refresh, invalidate, serviceinfo } from "./api"

const { PORT, BIND_ADDRESS } = process.env

const prisma = new PrismaClient({
    log: [
        {
            level: "info",
            emit: "stdout"
        },
        {
            level: "warn",
            emit: "stdout"
        },
        {
            level: "query",
            emit: "stdout"
        }
    ]
})

prisma.connect()
    .then(() => {
        const app = express();
        app.use(bodyparser.json())
        app.post("/register", register(prisma))
        app.post("/login", login(prisma))
        app.post("/refresh", refresh(prisma))
        app.get("/invalidate", invalidate(prisma))
        app.get("/serviceinfo", serviceinfo(prisma))

        const port = parseInt(PORT!)
        if (isNaN(port)) throw new Error("PORT expected to be an integer")
        console.log(`Starting server on ${BIND_ADDRESS}:${port}`)
        app.listen(port, BIND_ADDRESS!, 10000)
    })
    .catch(console.error)
    .finally(() => {
        prisma.disconnect()
    })
