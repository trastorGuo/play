import { TestService } from '../../service/test/test';
export declare class TestController {
    private readonly appService;
    constructor(appService: TestService);
    getHello(): string;
    findOne(): Promise<import("../../entity/bookkeeping/users.entity").User>;
}
