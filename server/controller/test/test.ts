/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-17 15:11:17
 */
import { Controller, Get } from '@nestjs/common';
import { TestService } from '../../service/test/test';

@Controller("test")
export class TestController {
  constructor(private readonly appService: TestService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("findOne")
  async findOne() {
    return await this.appService.findOne("1");
  }
}
