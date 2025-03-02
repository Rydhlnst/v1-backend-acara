import {Response} from "express"
import { IReqUser } from "../utils/interface"
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
    async single(req: IReqUser, res: Response) {
        if(!req.file) {
            return response.error(res, null, "File not found")
        }
        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);
            response.success(res, result, "Success upload a file")
        } catch (error) {
            console.error("Upload error:", error);
            response.error(res, null, "Failed to upload file")
        }
    },
    async multiple(req: IReqUser, res: Response) {
        if(!req.files || req.files.length === 0) {
            return response.error(res, null, "Files not found")
        }
        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            response.success(res, result, "Success upload files")
        } catch {
            response.error(res, null, "Failed to upload files")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const {fileUrl} = req.body as {fileUrl : string};
            const result = await uploader.remove(fileUrl);
            response.success(res, result, "Success delete file")
    } catch  {
        response.error(res, null, "Failed to delete file")
    }},
};