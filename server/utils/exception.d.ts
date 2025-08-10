export declare function exception(content: ErrorType, status?: number): void;
export interface ErrorType {
    code: number;
    content: string;
}
export declare enum ErrorStatus {
    VALUE_IS_NULL = 1000
}
