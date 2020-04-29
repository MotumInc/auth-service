import { handleUnaryCall as handleUnaryType, ServerUnaryCall } from "grpc"
import { PrismaClient } from "@prisma/client"

export type UnaryHandler<P, R> = (prisma: PrismaClient, call: ServerUnaryCall<P>) => Promise<R>

export const handleUnaryCall = <P, R>(handler: UnaryHandler<P, R>) =>
    (prisma: PrismaClient): handleUnaryType<P, R> =>
        (call, callback) =>
            handler(prisma, call)
                .then(res => callback(null, res))
                .catch(err => callback(err, null))