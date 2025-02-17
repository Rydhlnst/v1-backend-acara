import express from "express";
import dummyController from "../controller/dummy.controller";
import authController from "../controller/auth.controller";

const router = express.Router();

router.get("/dummy", dummyController.dummy);
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

export default router;