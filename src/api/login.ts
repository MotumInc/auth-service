import { verify } from "password-hash"
import { APIError, wrapAPI } from "../util/api"
import inShapeOf, { Schema } from "../util/inShapeOf"
import { generateAccessToken, generateRefreshToken } from "../util/token"
import { getUser } from "../util/user-registry"

const requestShape: Schema = {
    login: String,
    password: String
}

export default wrapAPI(async req => {
    if (!inShapeOf(req.body, requestShape)) throw new APIError("Invalid request format", 400)
    const { login, password } = req.body
    const user = await getUser({ login })
    if (!user) throw new APIError("Cannot find user")
    if (!verify(password, user.hash)) throw new APIError("Wrong password")
    const payload = { id: user.id, login: user.login, tokenrevision: user.tokenrevision }
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(payload),
        generateRefreshToken(payload)
    ])
    return { accessToken, refreshToken }
})