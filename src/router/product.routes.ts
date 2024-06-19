import * as express from "express";
import { createValidator } from "express-joi-validation";
import { product_joi, id_joi, query_params_joi, ProductController } from "..";
const validator = createValidator({ passError: true });

export const ProductRoutes = (app: express.Application) => {
    app.post('/', validator.body(product_joi), ProductController.create);
    app.get('/',  validator.query(query_params_joi), ProductController.getAll);
    app.get('/:id', validator.params(id_joi), ProductController.getById);
    app.put('/:id', validator.params(id_joi), validator.body(product_joi), ProductController.update);
    app.delete('/:id', validator.params(id_joi), ProductController.delete);
};