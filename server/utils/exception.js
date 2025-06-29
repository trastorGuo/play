"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStatus = exports.exception = void 0;
const common_1 = require("@nestjs/common");
function exception(content, status = common_1.HttpStatus.OK) {
    throw new common_1.HttpException(content, status);
}
exports.exception = exception;
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["VALUE_IS_NULL"] = 1000] = "VALUE_IS_NULL";
})(ErrorStatus = exports.ErrorStatus || (exports.ErrorStatus = {}));
//# sourceMappingURL=exception.js.map