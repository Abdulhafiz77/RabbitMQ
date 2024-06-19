import * as express from "express";
import { errorHandler } from "..";
import { ProductRoutes } from "./product.routes";



function nestedRoutes(this: any, path, configure) {
    const router = express.Router({ mergeParams: true });
    this.use(path, router);
    configure(router);
    return router;
}

express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const expressRouter = express.Router({ mergeParams: true });

export const routes = (app: express.Application) => {

    expressRouter['prefix']('/api', app => {

        app['prefix']('/product', data => {
            ProductRoutes(data)
        });

    })

    app.use(expressRouter);
    app.use(errorHandler);
};