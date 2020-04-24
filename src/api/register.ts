import { generate } from "password-hash"
import { APIError, wrapAPI } from "../util/api"
import inShapeOf, { Schema } from "../util/inShapeOf"
import { generateAccessToken, generateRefreshToken } from "../util/token"
import { addUser, getUser } from "../util/user-registry"

const requestShape: Schema = {
    login: String,
    password: String,
    name: String
}

export default wrapAPI(async req => {
    if (!inShapeOf(req.body, requestShape)) throw new APIError("Invalid request format", 400)
    const { login, password, name } = req.body
    const user = await getUser({ login })
    if (user) throw new APIError("User already exists")
    const hash = generate(password, { iterations: 10, saltLength: 20 })
    const apiUser = await addUser({ login, hash, name })
    if (!apiUser) throw new APIError("Error occured in registration process")
    const tokenPayload = {
        id: apiUser.id,
        login: apiUser.login,
        tokenRevision: apiUser.tokenRevision
    }
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(tokenPayload),
        generateRefreshToken(tokenPayload)
    ])
    return { accessToken, refreshToken }
})
