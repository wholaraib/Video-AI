import mongoose, { Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email : string;
    password: string;
    _id? : mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return next();
    
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})