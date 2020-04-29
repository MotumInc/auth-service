import { verifyAccessToken, Payload } from "../util/token"
import { wrapAPI, APIError } from "../util/api"

export default wrapAPI(async (req, prisma) => {
    const token = req.headers["authorization"]
    if (!token) throw new APIError("Unauthorized", 401)
    const { id, tokenRevision } = await verifyAccessToken<Payload>(token)

    const user = await prisma.credentials.findOne({
        where: { id }
    })

    if (!user) throw new APIError("Cannot find user")
    if (tokenRevision !== user.tokenRevision) throw new APIError("Invalid session", 401)

    await prisma.credentials.update({
        data: {
            tokenRevision: tokenRevision + 1
        },
        where: { id }
    })
})
