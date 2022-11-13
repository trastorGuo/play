/*
 * @Description: 异常
 * @Date: 2022-09-17 22:10:26
 * @Author: 
 * @LastEditTime: 2022-09-18 21:55:00
 */

import { HttpException, HttpStatus } from "@nestjs/common";

export function exception(content: ErrorType, status: number = HttpStatus.OK) {
    throw new HttpException(content, status); 
}

export interface ErrorType {
    code: number,
    content: string
}

export enum ErrorStatus {
    VALUE_IS_NULL = 1000
}
