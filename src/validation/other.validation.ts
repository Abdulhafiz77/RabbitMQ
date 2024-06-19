import * as Joi from 'joi'

const query_params_joi = Joi.object({
    limit: Joi.number().min(5).allow(null),
    status: Joi.number().min(0).max(10).allow(null),
    page: Joi.number().min(1).allow(null)
}).unknown(true);

const id_joi = Joi.object({
    id: Joi.number().required()
}).unknown(true);

export {
    query_params_joi,
    id_joi
}
