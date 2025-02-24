import {Response, NextFunction} from "express"
import { IReqUser } from "../utils/interface";
import response from "../utils/response";


// Dapat diakses jika user dapat login

export default (roles:string[]) => { // ["admin", "member"]
    return (req: IReqUser, res: Response, next:NextFunction) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) {
            return response.unauthorized(res, "Forbidden");
        }
        next();
    };
} 