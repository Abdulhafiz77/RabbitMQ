import * as Joi from 'joi'

const product_joi = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required()
}).unknown(true);


export {
    product_joi
}