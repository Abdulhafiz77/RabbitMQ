import { pgPoolQuery, ProductModel, QueryParams, BaseStatusEnum } from "..";

export class ProductRepository {

    static async getAll(params: QueryParams): Promise<ProductModel[]> {

        const parameters: any = [];
        let pagination = '';

        if (params.limit && !isNaN(params.page)) {
            parameters.push(params.limit, (params.page - 1) * params.limit);
            pagination = ` LIMIT $1 OFFSET $2`;
        }

        const sql = `SELECT p.id,
                            p.name,
                            p.description,
                            p.price,
                            p.status,
                            p.created_at,
                            p.updated_at
                     FROM public.product p
                     WHERE 1=1
                     ORDER BY p.id ASC ${pagination};`

        const result = await pgPoolQuery(sql, parameters);

        return result.rows;
    }
    static async getByName(name: string): Promise<ProductModel> {
        const sql = `select p.id,
                            p.name,
                            p.description,
                            p.price,
                            p.status,
                            p.created_at,
                            p.updated_at
                            from public.product p
                        where p.name = $1`
        const result = await pgPoolQuery(sql, [name]);

        return result.rows[0]
    }


    static async getById(id: number): Promise<ProductModel> {
        const sql = `select p.id,
                            p.name,
                            p.description,
                            p.price,
                            p.status,
                            p.created_at,
                            p.updated_at
                            from public.product p
                        where p.id = $1`
        const result = await pgPoolQuery(sql, [id]);

        return result.rows[0]
    }

    static async create(params: ProductModel): Promise<ProductModel> {
        const sql = `
                INSERT INTO public.product (name, description, price) VALUES ($1, $2, $3) RETURNING *;`
        const result = await pgPoolQuery(sql,
            [params.name, params.description, params.price]);

        return result.rows[0];
    }

    static async update(params: ProductModel): Promise<ProductModel> {

        const sql = `update public.product set  name = $1,
                                        description = $2,
                                        price = $3,
                                        status = $4
                                        where id = $5 RETURNING *;`
        const result = await pgPoolQuery(sql,
            [params.name, params.description, params.price, params.status, params.id]);

        return result.rows[0];
    }

    static async delete(id: number): Promise<void> {
        const sql = `UPDATE public.product SET status = ${BaseStatusEnum.DELETED} where id = $1`;
        await pgPoolQuery(sql, [id]);
    }

}