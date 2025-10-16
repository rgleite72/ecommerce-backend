import type { UserEntity } from "../domain/entities/user.entity";

export type CreateUserInput = {
    name: string
    email: string
    passwordHash?: string | null
    role?: "user" | "admin"
}

export type UpdateUserInput = Partial<Pick<UserEntity, "name" | "email" | "role" | "passwordHash">>

export type SearchParams = { page: number; limit: number; q?: string}
export type SearchResult = { data: UserEntity[], total: number}

export interface IUsersRepository {
    findById(id: string): Promise<UserEntity | null>
    findByEmail(email: string): Promise<UserEntity | null>
    search(params: SearchParams): Promise<SearchResult>
    create(data: CreateUserInput): Promise<UserEntity>
    update(id: string, data: UpdateUserInput): Promise<UserEntity>
    softDelete(id: string): Promise<void>
}

