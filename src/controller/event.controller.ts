import { Response } from "express"
import { IPaginationQuery, IReqUser } from "../utils/interface"
import response from "../utils/response"
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const payload = {...req.body, createdBy: req.user?.id} as TEvent;
            await eventDAO.validate(payload);
            const result = await EventModel.create(payload);
            response.success(res, result, "Success Create Event")
        } catch (error) {
            response.error(res, error, "Failed to create an event")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const {
                limit, page, search
            } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TEvent> = {};

            if (search) {
                Object.assign(query, {...query, $text: {
                    $search: search
                }})
            }

            const result = await EventModel.find(query).limit(limit).skip((page - 1) * limit).exec();
            const count = await EventModel.countDocuments(query);

            response.pagination(res, result, {
                current: page,
                total: count,
                totalPage: Math.ceil(count/limit)
            }, "Success fetch all events");

        } catch (error) {
            response.error(res, error, "Failed find all events")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await EventModel.findById(id);
            response.success(res, result, "Success find one event");
        } catch (error) {
            response.error(res, error, "Failed to fine one an event")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await EventModel.findByIdAndUpdate(id, req.body, {new: true});
            response.success(res, result, "Success update event");
        } catch (error) {
            response.error(res, error, "Failed to update an event")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            const result = await EventModel.findByIdAndDelete(id, {new: true});
            response.success(res, result, "Success remove an event");
        } catch (error) {
            response.error(res, error, "Failed to remove an event")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const {slug} = req.params;
            const result = await EventModel.findOne({slug});
            response.success(res, result, "Success find one by slug event");
        } catch (error) {
            response.error(res, error, "Failed to fine one by slug event")
        }
    },

}