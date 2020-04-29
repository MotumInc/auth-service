import express from "express";
import bodyparser from "body-parser";
import { PrismaClient } from "@prisma/client"
import { Server, ServerCredentials } from "grpc";
import { register, login, refresh, invalidate, serviceinfo, verify } from "./api"
import { AuthService } from "./protobuf-gen/auth_grpc_pb";

const { PORT, BIND_ADDRESS, SERVICE_PORT } = process.env

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

const asyncBind = (
    server: Server,
    address: string,
    credentials: ServerCredentials
) =>
    new Promise((resolve, reject) => {
        server.bindAsync(address, credentials, (err, port) => {
            if (err) reject(err)
            resolve(port)
        })
    })

const grpcServer = async (
    address: string,
    port: string | number,
    prisma: PrismaClient
) => {
    const server = new Server()
    server.addService(AuthService, { verify: verify(prisma) })
    await asyncBind(
        server,
        `${address}:${port}`,
        ServerCredentials.createInsecure()
    )
    return server
}


Promise.all([grpcServer(BIND_ADDRESS!, SERVICE_PORT!, prisma), prisma.connect()])
    .then(([server]) => {
        server.start()
        console.log(`Started gRPC server on ${BIND_ADDRESS}:${SERVICE_PORT}`)

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
