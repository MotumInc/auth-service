import { credentials } from "grpc"
import {
    UserQuery,
    User,
    AddUserRequest,
    UpdateUserQuery,
    UserResponse,
    VoidResponse,
} from "../protobuf-gen/user-registry_pb"
import { UserRegistryClient } from "../protobuf-gen/user-registry_grpc_pb"

export type Query = Partial<UserQuery.AsObject>

const { USER_REGISTRY_URL } = process.env

const client = new UserRegistryClient(USER_REGISTRY_URL!, credentials.createInsecure())

const getUserRPC = (query: UserQuery) =>
    new Promise<UserResponse>((resolve, reject) => {
        client.getUser(query, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

const addUserRPC = (user: AddUserRequest) =>
    new Promise<User>((resolve, reject) => {
        client.addUser(user, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

const updateUserRPC = (request: UpdateUserQuery) => 
    new Promise<VoidResponse>((resolve, reject) => {
        client.updateUser(request, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

export const getUser = async ({ id, login }: Query): Promise<User.AsObject | null> => {
    const request = new UserQuery()
    if (id !== undefined) request.setId(id)
    if (login !== undefined) request.setLogin(login)
    const response = await getUserRPC(request)
    return response.getUser()?.toObject() || null
}

export const addUser = async ({ name, login, hash }: AddUserRequest.AsObject): Promise<User.AsObject> => {
    const request = new AddUserRequest()
    request.setName(name)
    request.setHash(hash)
    request.setLogin(login)
    const response = await addUserRPC(request)
    return response.toObject()
}

export const updateUser = async (
    { id, login: queryLogin }: Query,
    { hash, login, name, tokenRevision }: Partial<Omit<UpdateUserQuery.AsObject, "query">>
): Promise<void> => {
    const request = new UpdateUserQuery()
    const query = new UserQuery()
    if (id !== undefined) query.setId(id)
    if (queryLogin !== undefined) query.setLogin(queryLogin)
    request.setQuery(query)
    if (hash !== undefined) request.setHash(hash)
    if (login !== undefined) request.setLogin(login)
    if (name !== undefined) request.setName(name)
    if (tokenRevision !== undefined) request.setTokenRevision(tokenRevision)
    updateUserRPC(request)
}
