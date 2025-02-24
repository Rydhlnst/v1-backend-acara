import express, {Request, Response} from "express";
import dummyController from "../controller/dummy.controller";
import authController from "../controller/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get("/dummy", dummyController.dummy);
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
// Jika terdapat error TypeError: Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body. Masalahnya disini
router.post("/auth/activation", authController.activation);

router.get("/test-acl", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], (req: Request, res: Response) => {
    res.status(200).json({
        message: "Ok",
        data: "Success"
    })
})

export default router;