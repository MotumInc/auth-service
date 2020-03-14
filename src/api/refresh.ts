import { APIError, wrapAPI } from "../util/api"
import { generateAccessToken, generateRefreshToken, Payload, verifyRefreshToken } from "../util/token"
import { getUser } from "../util/user-registry"

export default wrapAPI(async req => {
    const decoded = await verifyRefreshToken<Payload>(req.body)
    const { id, login, tokenrevision } = decoded
    const user = await getUser({ id })
    if (!user) throw new APIError("User is not found")
    if (user.tokenrevision !== tokenrevision) throw new APIError("Invalid session")
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(decoded),
        generateRefreshToken(decoded)
    ])
    return { accessToken, refreshToken }
})
