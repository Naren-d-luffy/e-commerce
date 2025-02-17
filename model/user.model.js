import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "vendor"], default: "user" },
    status:{type:String, enum:["ACTIVE", "INACTIVE"], required:true, default:"ACTIVE"},
    verified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; 
  return user;
};
  
export default mongoose.model("User", userSchema);
