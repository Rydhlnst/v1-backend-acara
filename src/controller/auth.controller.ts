import * as Yup from "yup";
import { Request, Response } from "express";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type TRegister = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type TLogin = {
    identifier: string;
    password: string;
}

// Validasi Schema Register
const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    userName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), ""], "Password must match")
})

export default {
    async register(req: Request, res: Response) {
        /**
         #swagger.tags = ['Auth']
         */
        const {fullName, userName, email, password, confirmPassword} = req.body as unknown as TRegister;

        const result = await UserModel.create({
            fullName,
            userName,
            email,
            password
        });
        // Proses PROMISE
        try {
            await registerValidateSchema.validate({fullName, userName, email, password, confirmPassword})
            res.status(200).json({
                message: "Register Success",
                data: {
                    result
                }
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }

    },

    async login(req: Request, res: Response) {
        /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/LoginRequest"}}
         */
        const {identifier, password} = req.body as unknown as TLogin;

        try {
            // Ambil Data User berdasarkan identifier -> email / username
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier
                    },
                    {
                        userName: identifier
                    }
                ]
            });

            if(!userByIdentifier) {
                return res.status(403).json({
                    message: "User Not Found",
                    data: null
                })
            }
            // Validasi password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
            if(!validatePassword) {
                return res.status(403).json({
                    message: "Password Not Match",
                    data: null
                })
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            })

            res.status(200).json({
                message: "Login Success",
                data: token
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    async me(req: IReqUser, res: Response) {
        /**
        #swagger.tags = ['Auth']
        #swagger.security = [{
            "bearerAuth": []
         }]
         */
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Me Success",
                data: result
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    }
}