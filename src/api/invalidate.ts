import { verifyAccessToken, Payload } from "../util/token"
import { wrapAPI, APIError } from "../util/api"
import { getUser, updateUser } from "../util/user-registry"

export default wrapAPI(async req => {
    const token = req.headers["authorization"]
    if (!token) throw new APIError("Unauthorized")
    const { id, tokenrevision } = await verifyAccessToken<Payload>(token)
    const user = await getUser({ id })
    if (!user) throw new APIError("Cannot find user")
    if (tokenrevision !== user.tokenrevision) throw new APIError("Invalid session")
    await updateUser({ id }, { tokenrevision: tokenrevision + 1 })
})
