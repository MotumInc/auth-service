import { APIError, wrapAPI } from "../util/api"
import { generateAccessToken, generateRefreshToken, Payload, verifyRefreshToken } from "../util/token"

export default wrapAPI(async (req, prisma) => {
    if (!req.body.refreshToken) throw new APIError("No refresh token provided", 400)

    const decoded = await verifyRefreshToken<Payload>(req.body.refreshToken)
    const { id, tokenRevision } = decoded

    const user = await prisma.credentials.findOne({
        where: { id }
    })
    if (!user) throw new APIError("User is not found", 404)

    if (user.tokenRevision !== tokenRevision) throw new APIError("Invalid session", 401)
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(decoded),
        generateRefreshToken(decoded)
    ])
    return { accessToken, refreshToken }
})
