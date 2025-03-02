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
import eventController from "../controller/event.controller";

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

router.post("/category", [authMiddleware, aclMiddleware([ROLES.ADMIN])] ,categoryController.create
    /*
    #swagger.tags = ["Category"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
    required: true,
    schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
    }}
    */
)
router.get("/category", categoryController.findAll
    /**
     #swagger.tags = ["Category"]
     */
);
// router.post("/media/upload-single", categoryController);
router.get("/category/:id", categoryController.findOne
    /**
     #swagger.tags = ["Category"]
     */
);
router.put("/category/:id",[authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update
    /*
    #swagger.tags = ["Category"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);
router.delete("/category/:id",[authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove
    /*
    #swagger.tags = ["Category"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    */
);

router.post("/events", [authMiddleware, aclMiddleware([ROLES.ADMIN])] ,eventController.create
     /*
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
        $ref: "#/components/schemas/CreateEventRequest"
        }
    }
    */
);
router.get("/events", eventController.findAll
    /*
    #swagger.tags = ["Events"]
    */

);
router.get("/events/:id", eventController.findOne
    /*
    #swagger.tags = ["Events"]
    */

);
router.put("/events/:id", eventController.update
     /*
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
        $ref: "#/components/schemas/CreateEventRequest"
        }
    }
    */
);
router.delete("/events/:id", eventController.remove
    /*
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth": {}
    }]*/
);
router.get("/events/:slug/slug", eventController.findOneBySlug
    /*
    #swagger.tags = ["Events"]
    */
);

router.get("/regions", regionController.getAllProvinces
    /*
    #swagger.tags = ["Regions"]
    */

);
router.get("/regions/:id/province", regionController.getProvince
    /*
    #swagger.tags = ["Regions"]
    */

);
router.get("/regions/:id/regency", regionController.getRegency
    /*
    #swagger.tags = ["Regions"]
    */
);
router.get("/regions/:id/regency",[authMiddleware, aclMiddleware([ROLES.ADMIN])], regionController.getRegency
    /*
    #swagger.tags = ["Regions"]
    */
);
router.get("/regions/:id/village",[authMiddleware, aclMiddleware([ROLES.ADMIN])], regionController.getVillage
    /*
    #swagger.tags = ["Regions"]
    */
);
router.get("/regions-search", regionController.findByCity
    /*
    #swagger.tags = ["Regions"]
    */
);

// Mengupload jelas menggunakan HTTP method post
router.post("/media/upload-single", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.single("file")
], mediaController.single
    /*
    #swagger.tags = ["Media"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                file: {
                    type: "string",
                    format: "binary"
                }}
            }
            }
        }
    }
    */
);
router.post("/media/upload-multiple", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple("files")
], mediaController.multiple
    /*
    #swagger.tags = ["Media"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
       #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
            schema: {
                type: "array",
                properties: {
                files: {
                    type: "string",
                    format: "binary"
                }}
            }
            }
        }
    }
    */
);
router.delete("media/remove", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove
/*
    #swagger.tags = ["Media"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = [{
        required: true,
        schema: {
        $ref: "#/components/schemas/RemoveMediaRequest"}
    }]
*/
)

export default router;