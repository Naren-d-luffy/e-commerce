import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'staff', 'admin', 'vendor'], default: 'buyer' },
    status : {type: String, enum:['ACTIVE','INACTIVE']},
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; 
  return user;
};

export default mongoose.model('User', userSchema);
