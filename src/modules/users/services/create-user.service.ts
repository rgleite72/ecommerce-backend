import bcrypt from 'bcrypt'
import { AppError } from '../../../shared/errors/AppError'
import type { CreateUserDTO } from '../dto/create-user.dto'
import type { IUsersRepository } from '../repositories/users.repository'


export class CreateUserService{

    constructor(private repo: IUsersRepository){}


    async execute(dto: CreateUserDTO){

        const existing = await this.repo.findByEmail(dto.email)
        if(existing) throw new AppError('Email já está sendo utilizado', 409)

        const passwordHash = dto.password
        ? await bcrypt.hash(
          dto.password,
          Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
        )
        : null;

        const user = await this.repo.create({
            name: dto.name,
            email: dto.email,
            role: dto.role ?? "user",
            passwordHash,
        })

        return user.toJSONSafe ? user.toJSONSafe() : { ...user, passwordHash: undefined}

    }



}