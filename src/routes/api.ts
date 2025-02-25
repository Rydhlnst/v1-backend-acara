import express, {Request, Response} from "express";
import dummyController from "../controller/dummy.controller";
import authController from "../controller/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import { ROLES } from "../utils/constant";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controller/media.controller";
import categoryController from "../controller/category.controller";
import regionController from "../controller/region.controller";

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

router.post("/category", [authMiddleware, aclMiddleware([ROLES.ADMIN])] ,categoryController.create)
router.get("/category", categoryController.findAll);
router.post("/media/upload-single");
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id",[authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update);
router.delete("/category/:id",[authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove);

router.get("/regions", regionController.getAllProvinces);
router.get("/regions/:id/province", regionController.getProvince);
router.get("/regions/:id/regency", regionController.getRegency);
router.get("/regions/:id/regency", regionController.getRegency);
router.get("/regions/:id/village", regionController.getVillage);
router.get("/regions-search", regionController.findByCity);

// Mengupload jelas menggunakan HTTP method post
router.post("/media/upload-single", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.single("file")
], mediaController.single);
router.post("/media/upload-multiple", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple("files")
], mediaController.remove);
router.delete("media/remove", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove)

export default router;