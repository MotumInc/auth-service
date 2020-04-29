import { handleUnaryCall } from "../util/serviceHandler";
import { Token, TokenPayload } from "../protobuf-gen/auth_pb";
import { verifyAccessToken, Payload } from "../util/token";

export default handleUnaryCall<Token, TokenPayload>(async (prisma, call) => {
    const token = call.request.getToken()

    try {
        const { id, tokenRevision } = await verifyAccessToken<Payload>(token)
        const user = await prisma.credentials.findOne({
            where: { id },
            select: { tokenRevision: true }
        })
        if (!user) throw new Error("User does not exist")
        if (tokenRevision != user.tokenRevision) throw new Error("Invalid token")

        const payload = new TokenPayload()
        payload.setId(id)
        return payload
    } catch {
        throw new Error("Invalid token")
    }
})