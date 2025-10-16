import type { IUsersRepository } from "../repositories/users.repository";
import { AppError } from "../../../shared/errors/AppError";

export class GetUserByIdService{

    constructor (private repo: IUsersRepository){}


    async execute(id: string){

        const user = await this.repo.findById(id)

        if(!user) throw new AppError("Usuário não existe", 404)

        return user.toJSONSafe ? user.toJSONSafe() : user

    }

}