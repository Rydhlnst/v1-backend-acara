import {Response, NextFunction} from "express"
import { IReqUser } from "./auth.middleware";

// Dapat diakses jika user dapat login

export default (roles:string[]) => { // ["admin", "member"]
    return (req: IReqUser, res: Response, next:NextFunction) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                message: "Forbidden",
                data: null
            })
        }
        next();
    };
} 