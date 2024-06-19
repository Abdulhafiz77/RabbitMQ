
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ErrorEnum } from '..';

export class ErrorService {


    static error(res, errors: any, statusCode = INTERNAL_SERVER_ERROR, message = null): any {
        console.log(errors)
        
        res.status(statusCode)
            .send({
                status: statusCode,
                message: message ?? ErrorEnum.invalidData,
                errors: errors.errors ? errors.errors : errors,
            });
    }
    
    static validationError(res: any, error: any) {
        let valid = {};
        for (const item of error) {
            valid[`${item.context.key}`] = item.message;
        }
        res.status(UNPROCESSABLE_ENTITY).json({
            status: UNPROCESSABLE_ENTITY, message: 'Invalid data!', errors: valid
        })
    }
}
