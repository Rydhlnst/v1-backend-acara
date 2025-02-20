import mongoose, { mongo } from "mongoose";
import { encrypt } from "../utils/encryption";
import {renderMailHtml, sendMail} from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMPT_USER } from "../utils/env";

export interface IUser {
    fullName: string,
    userName: string,
    email: string,
    password: string,
    role: string,
    profilePicture: string,
    isActive: boolean,
    activationCode: string,
    createdAt?: string;
}

// Schema User
const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
    fullName: {
        type: Schema.Types.String,
        required: true
    },
    userName: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user",
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg"
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false
    },
    activationCode: {
        type: Schema.Types.String,

    }
}, {
    timestamps: true,
})

// Pre Save Password akan di Encrypt
UserSchema.pre("save", function(next) {
    const user = this
    user.password = encrypt(user.password);
    // Akan menjadi activation code dengan mengecnnrypt id
    user.activationCode = encrypt(user.id);
    next();
});

UserSchema.post("save", async function(doc, next) {
    try {
        const user = doc;
        console.log("Send Mail to: ", user.email);

        const contentMail = await renderMailHtml("registration-success.ejs", {
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
        });

        await sendMail({
            from: EMAIL_SMPT_USER,
            to: user.email,
            subject: "Activation Account",
            html: contentMail,
        })
    } catch (error) {
        console.log(error)
    } finally {
        next();
    }
    
    
})

// Menghapus Password dari Response
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;