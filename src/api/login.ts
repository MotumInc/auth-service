import { verify } from "password-hash"
import { APIError, wrapAPI } from "../util/api"
import inShapeOf, { TypeOf } from "../util/inShapeOf"
import { generateAccessToken, generateRefreshToken } from "../util/token"

const requestShape = {
    login: String,
    password: String,
}

export default wrapAPI(async (req, prisma) => {
    if (!inShapeOf(req.body, requestShape)) throw new APIError("Invalid request format", 400)
    const { login, password } = req.body as TypeOf<typeof requestShape>

    const user = await prisma.credentials.findOne({
        where: { login }
    })
    if (!user) throw new APIError("Cannot find user")

    if (!verify(password, user.hash)) throw new APIError("Wrong password", 400)
    const payload = {
        id: user.id,
        tokenRevision: user.tokenRevision
    }
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(payload),
        generateRefreshToken(payload)
    ])
    return { accessToken, refreshToken }
})