import { User } from '../../entity/bookkeeping/users.entity';
import { Repository } from 'typeorm';
export declare class TestService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    getHello(): string;
    findOne(id: string): Promise<User>;
}
