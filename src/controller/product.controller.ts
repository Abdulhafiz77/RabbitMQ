import { ErrorService, generateCorrelationId, getPaginationResponse } from '../utils';
import { ErrorEnum, PaginationParams, ProductModel, ValidatedRequestBody, ValidatedRequestQuery } from '../model';
import { ValidatedRequest } from 'express-joi-validation';
import { ProductRepository } from '../repository';
import { CONFLICT } from 'http-status-codes';
import { rabbitMQService } from '../utils/rabbitmq.service';
import redisService from '../utils/redis.service';

export class ProductController {

    static async getAll(req: ValidatedRequest<ValidatedRequestQuery<PaginationParams>>, res) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const message = { page, limit };
            const correlationId = generateCorrelationId();  
        
            rabbitMQService.sendRequest(message, correlationId, (response) => {
                if (response.error) {
                    return ErrorService.error(res, response.error);
                }
         
                let data = JSON.parse(response);
                if (!data[0]) return res.send(null);

                if (req.query.limit && !isNaN(req.query.page))
                    return res.send(getPaginationResponse<ProductModel>(data, req.query.page, req.query.limit, Number(data[0].count)));
                //redis
                 redisService.getAll(String(data!))
                return res.send(data);
            });

        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getById(req: ValidatedRequest<any>, res) {
        try {

            let data = await ProductRepository.getById(req.params.id);
            return res.send(data);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async create(req: ValidatedRequest<ValidatedRequestBody<ProductModel>>, res) {
        try {
            console.log(req.body)
            let checkName = await ProductRepository.getByName(req.body.name);
            if (checkName) return ErrorService.error(res, ErrorEnum.nameUsed, CONFLICT);
            console.log(req.body)
            const data = await ProductRepository.create(req.body)

            return res.send(data);

        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async update(req: ValidatedRequest<ValidatedRequestBody<ProductModel>>, res) {
        try {
            req.body.id = req.params.id;
            let checkId = await ProductRepository.getById(req.params.id);
            if (!checkId) return ErrorService.error(res, ErrorEnum.NotFound, CONFLICT);
            if (!req.body.status) req.body.status = checkId.status!;

            let checkName = await ProductRepository.getByName(req.body.name);
            if (checkName && checkName.id != req.body.id) return ErrorService.error(res, ErrorEnum.nameUsed, CONFLICT);

            let data = await ProductRepository.update(req.body); 

            return res.send(data);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async delete(req: ValidatedRequest<any>, res) {
        try {

            await ProductRepository.delete(req.params.id);
           await redisService.delete(String(req.params.id), req.headers.authorization.split(' ')[1])
            return res.send({ success: true });

        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

}
