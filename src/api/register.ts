import { generate } from "password-hash"
import { APIError, wrapAPI } from "../util/api"
import inShapeOf, { TypeOf } from "../util/inShapeOf"
import { generateAccessToken, generateRefreshToken } from "../util/token"
import { addUser, getUser } from "../util/user-registry"

const requestShape = {
    login: String,
    password: String,
    name: String,
}

const loginRegex = /^[a-zA-Z_][a-zA-Z_.\-0-9]+$/
const passwordRegex = /^[a-zA-Z_.\-0-9]{6,}$/
const uppercaseRegex = /[A-Z]/
const lowecaseRegex = /[a-z]/
const numberRegex = /[0-9]/

export default wrapAPI(async req => {
    if (!inShapeOf(req.body, requestShape)) throw new APIError("Invalid request format", 400)
    const { login: requestLogin, password, name } = req.body as TypeOf<typeof requestShape>
    const login = requestLogin.toLocaleLowerCase();

    const user = await getUser({ login })
    if (user) throw new APIError("User already exists")

    if (!loginRegex.test(login)) throw new APIError("Login contains invalid characters", 400)
    if (password.length < 6) throw new APIError("Password is too short", 400)
    if (!passwordRegex.test(password)) throw new APIError("Password contains invalid characters or if frormatted wrong", 400)
    if (!uppercaseRegex.test(password)) throw new APIError("Password should contain uppercase letters", 400)
    if (!lowecaseRegex.test(password)) throw new APIError("Password should contain lowercase letters", 400)
    if (!numberRegex.test(password)) throw new APIError("Password should contain numbers", 400)

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
