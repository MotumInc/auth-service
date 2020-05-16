import { credentials } from "grpc"
import {
    UserQuery,
    User,
    AddUserRequest,
    UserResponse,
} from "../protobuf-gen/user-registry_pb"
import { UserRegistryClient } from "../protobuf-gen/user-registry_grpc_pb"

export type Query = UserQuery.AsObject

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

export const getUser = async ({ id }: Query): Promise<User.AsObject | null> => {
    const request = new UserQuery()
    request.setId(id)
    const response = await getUserRPC(request)
    return response.getUser()?.toObject() || null
}

export interface AddUser {
    id: number;
    name: string;
}
export const addUser = async ({ id, name }: AddUser): Promise<User.AsObject> => {
    const request = new AddUserRequest()
    request.setId(id)
    request.setName(name)
    request.setUsingMetric(true)
    const response = await addUserRPC(request)
    return response.toObject()
}