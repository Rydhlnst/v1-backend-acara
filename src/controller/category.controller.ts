import { IPaginationQuery, IReqUser } from "../utils/interface"
import { Response } from "express"
import CategoryModel, {categoryDAO} from "../models/category.model"
import response from "../utils/response"

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await categoryDAO.validate(req.body);
            const result = await CategoryModel.create(req.body);
            response.success(res, result, "Success create category")

        } catch (error) {
            response.error(res, error, "Failed create category")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const {
            page = 1, limit = 10, search
        } = req.query as unknown as IPaginationQuery;
        try {
            const query = {};
            if (search) {
                // Apabila ada yang sesuai
                Object.assign(query, {
                    $or: [
                        {
                            name: {$regex: search, $options: "i"}
                        },
                        {
                            description: {$regex: search, $options: "i"}
                        }
                    ]
                })
            }

            const result = await CategoryModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec();

            // Butuh data seluruhnya
            const count = await CategoryModel.countDocuments(query);

            response.pagination(res, result, {
                total: count,
                totalPage: Math.ceil(count/limit),
                current: page
            }, "Success find all category")
        } catch (error) {
            response.error(res, error, "Failed find all category")
        }
    },
    // Berdasarkan params
    async findOne(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await CategoryModel.findById(id);
            response.success(res, result, "Success find one category");
        } catch (error) {
            response.error(res, error, "Failed fine one")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
                // Setiap ada update datanya langsung berubah
                new: true
            });
            response.success(res, result, "Success update category");
        } catch (error) {
            response.error(res, error, "Failed update")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await CategoryModel.findByIdAndDelete(id, {new: true});
            response.success(res, result, "Success remove category");
        } catch (error) {
            response.error(res, error, "Failed remove")
        }
    }

} 