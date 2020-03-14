import { UserQuery, User, AddUserRequest, UpdateUserQuery } from "../protobuf-gen/user-registry_pb"

export type Query = Partial<UserQuery.AsObject>

//TODO
export const getUser = async (query: Query): Promise<User.AsObject | null> => ({
    name: "John",
    id: "none",
    login: "@mail",
    hash: "",
    tokenrevision: 0
})

//TODO
export const addUser = async (user: AddUserRequest.AsObject): Promise<User.AsObject | null> => ({ ...user, id: "none", tokenrevision: 0 })

//TODO
export const updateUser = async (query: Query, modifications: Partial<Exclude<UpdateUserQuery.AsObject, "query">>): Promise<void> => {}