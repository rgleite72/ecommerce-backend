import { Repository, ILike, IsNull, Not } from "typeorm";
import { UserEntity } from "../domain/entities/user.entity";
import { IUsersRepository, CreateUserInput, UpdateUserInput, SearchParams, SearchResult } from "./users.repository";

const norm = (s: string) => s.trim().toLowerCase()

export class UsersRepositoryDB implements IUsersRepository{

    constructor(private repo: Repository<UserEntity>){}

    async findById(id: string): Promise<UserEntity | null> {
        return this.repo.findOne({ where: { id, deletedAt: IsNull() } })
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.repo.findOne({
            where: { email: ILike(norm(email)), deletedAt: IsNull() },
        })
    }

    async search(params: SearchParams): Promise<SearchResult> {
        
        const safePage = Math.max(1, params.page ?? 1)
        const safeLimit = Math.max(1, params.limit ?? 10)
        const skip = (safePage - 1) * safeLimit
        const like = params.q?.trim() ? `%${norm(params.q)}%` : null

        const where = 
            like 
            ? [{ deletedAt : IsNull(), name: ILike(like)},
               { deletedAt : IsNull(), email: ILike(like)}]
            : { deletedAt : IsNull()}

        const [ data, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: "DESC"},
            skip,
            take: safeLimit
        })

        return { data, total}
    }


    async create(data: CreateUserInput): Promise<UserEntity> {
        const email = norm(data.email);

        // Unicidade case-insensitive considerando apenas não deletados
        const exists = await this.repo.findOne({
        where: { email: ILike(email), deletedAt: IsNull() },
        });
        if (exists) throw new Error("Email already in use");


        const u = UserEntity.create({
        name: data.name,
        email,
        role: data.role ?? "user",
        passwordHash: data.passwordHash ?? null,
        });

        return this.repo.save(u);
    }
    

    async update(id: string, data: UpdateUserInput): Promise<UserEntity> {
        const u = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
        if (!u) throw new Error("User not found");

        if (typeof data.name === "string" && data.name !== u.name) u.rename(data.name);
        if (typeof data.role !== "undefined" && data.role !== u.role) u.role = data.role;
        if (typeof data.passwordHash !== "undefined" && data.passwordHash !== u.passwordHash) {
        u.passwordHash = data.passwordHash ?? null;
        }

        if (typeof data.email === "string" && data.email !== u.email) {
        const newEmail = norm(data.email);
        const clash = await this.repo.findOne({
            where: { email: ILike(newEmail), deletedAt: IsNull(), id: Not(id) },
        });
        if (clash) throw new Error("Email already in use");
        u.changeEmail(newEmail);
        }

        return this.repo.save(u);
    }

    async softDelete(id: string): Promise<void> {
        await this.repo.softDelete({ id });
    }



}