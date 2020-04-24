import { verifyAccessToken, Payload } from "../util/token"
import { wrapAPI, APIError } from "../util/api"
import { getUser, updateUser } from "../util/user-registry"

export default wrapAPI(async req => {
    const token = req.headers["authorization"]
    if (!token) throw new APIError("Unauthorized", 401)
    const { id, tokenRevision } = await verifyAccessToken<Payload>(token)
    const user = await getUser({ id })
    if (!user) throw new APIError("Cannot find user")
    if (tokenRevision !== user.tokenRevision) throw new APIError("Invalid session", 401)
    await updateUser({ id }, { tokenRevision: tokenRevision + 1 })
})
