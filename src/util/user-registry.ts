import { credentials } from "grpc"
import {
    UserQuery,
    User,
    AddUserRequest,
    UpdateUserQuery,
    VoidResponse
} from "../protobuf-gen/user-registry_pb"
import { UserRegistryClient } from "../protobuf-gen/user-registry_grpc_pb"
import { response } from "express"

export type Query = Partial<UserQuery.AsObject>

const { USER_REGISTRY_URL } = process.env

const client = new UserRegistryClient(USER_REGISTRY_URL!, credentials.createInsecure())

const fetchUser = (query: UserQuery) =>
    new Promise<User>((resolve, reject) => {
        client.getUser(query, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

const appendUser = (user: AddUserRequest) =>
    new Promise<User>((resolve, reject) => {
        client.addUser(user, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

const manipulateUser = (query: UpdateUserQuery) =>
    new Promise<VoidResponse>((resolve, reject) => {
        client.updateUser(query, (err, res) => {
            if (err) resolve(res)
            else reject(err)
        })
    })

export const getUser = async ({ id, login }: Query): Promise<User.AsObject | null> => {
    const request = new UserQuery()
    if (id !== undefined) request.setId(id)
    if (login !== undefined) request.setLogin(login)
    const response = await fetchUser(request)
    return response.toObject()
}

export const addUser = async ({ name, login, hash }: AddUserRequest.AsObject): Promise<User.AsObject> => {
    const request = new AddUserRequest()
    request.setName(name)
    request.setHash(hash)
    request.setLogin(login)
    const response = await appendUser(request)
    return response.toObject()
}

export const updateUser = async (
    { id, login: queryLogin }: Query,
    { hash, login, name, tokenrevision }: Partial<Omit<UpdateUserQuery.AsObject, "query">>
): Promise<void> => {
    const request = new UpdateUserQuery()
    const query = new UserQuery()
    if (id !== undefined) query.setId(id)
    if (queryLogin !== undefined) query.setLogin(queryLogin)
    request.setQuery(query)
    if (hash !== undefined) request.setHash(hash)
    if (login !== undefined) request.setLogin(login)
    if (name !== undefined) request.setName(name)
    if (tokenrevision !== undefined) request.setTokenrevision(tokenrevision)
}
