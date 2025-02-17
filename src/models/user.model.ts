import mongoose, { mongo } from "mongoose";
import { encrypt } from "../utils/encryption";

export interface IUser {
    fullName: string,
    userName: string,
    email: string,
    password: string,
    role: string,
    profilePicture: string,
    isActive: boolean,
    activationCode: string
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
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
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
    next();
});

// Menghapus Password dari Response
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;