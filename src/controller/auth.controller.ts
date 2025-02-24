import * as Yup from "yup";
import { Request, Response } from "express";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

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
    password: Yup.string().required().min(8, "Password must be at least 6 characters").test("at-least-one-uppercase-letter", "Contains at least one uppercase letter", (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);

    }).test("at-least-one-number", "Contains at least one number", (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
        
    }),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), ""], "Password must match")
})

export default {
    async register(req: Request, res: Response) {
        /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/RegisterRequest"}}
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
            response.success(res, result, "Success Registration")
        } catch (error) {
            const err = error as unknown as Error;
            response.error(res, error, "Failed Registration")
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
                // Apakah identifier cocok dengan email / userName
                $or: [
                    {
                        email: identifier
                    },
                    {
                        userName: identifier
                    }
                ],
                // Hanya user yang telah aktif saja yang bisa login
                isActive: true,
            });

            if(!userByIdentifier) {
                return response.unauthorized(res, "User not found")
            }
            // Validasi password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
            if(!validatePassword) {
                return response.unauthorized(res, "User not found")
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            })

            response.success(res, token, "Login Success")

        } catch (error) {
            const err = error as unknown as Error;
            response.error(res, error, "Login failed")
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

            response.success(res, result, "Success get user profile")

        } catch (error) {
            const err = error as unknown as Error;
            response.error(res, err, "Failed get user file")
        }
    },

    async activation(req: Request, res: Response) {
        /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/ActivationRequest"}}
         */
            try {
                // Ensure you're getting the code from the request body
                const { code } = req.body as { code: string };
            
                // Find and update the user
                const user = await UserModel.findOneAndUpdate(
                  { activationCode: code },
                  { isActive: true },
                  { new: true }
                );
            
                // If the user is found and updated successfully, send the response
                if (user) {
                  response.success(res, user, "Successfully activated")
                } 
              } catch (error) {
                // Handle any errors
                const err = error as Error;
                response.error(res, error, "User not found or User failed activated")
              }}
}