import joi from "joi";

const userValidation = joi.object({
  name: joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot be more than 30 characters",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: joi.string().min(8).required().messages({
    "string.min": "Password should have at least 8 characters",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
  role: joi.string().valid("buyer", "staff", "admin", "vendor").default("buyer"),
});

export default userValidation;
