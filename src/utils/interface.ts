import { Request } from "express";
import { Types } from "mongoose";
import { IUser } from "../models/user.model";

export interface IReqUser extends Request {
    user? : IUserToken;
}

export interface IUserToken extends Omit<IUser, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "userName">{
    id?: Types.ObjectId
}

export interface IPaginationQuery {
    page: number,
    limit: number,
    search?: string
}