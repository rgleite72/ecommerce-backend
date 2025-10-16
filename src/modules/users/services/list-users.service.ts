import type { SearchResult, IUsersRepository } from "../repositories/users.repository";


type ListParams = { page?: number; limit?: number; q?: string };

export class ListUsersService {

    constructor(private repo: IUsersRepository){}

    async execute(params: ListParams): Promise<SearchResult & { page: number; limit: number }> {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.max(1, params.limit ?? 10);
        const { data, total } = await this.repo.search({ page, limit, q: params.q });
        return { data, total, page, limit };
    }    

}

