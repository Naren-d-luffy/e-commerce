import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId format");
  }
  return value;
};

const productValidation = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name cannot be more than 100 characters",
    "string.empty": "Product name cannot be empty",
    "any.required": "Product name is required",
  }),

  description: Joi.string().trim().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot be more than 1000 characters",
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),

  category: Joi.string().trim().min(3).max(50).required().messages({
    "string.min": "Category must be at least 3 characters",
    "string.max": "Category cannot be more than 50 characters",
    "string.empty": "Category cannot be empty",
    "any.required": "Category is required",
  }),

  scheduledStartDate: Joi.date().required().messages({
    "date.base": "Scheduled start date must be a valid date",
    "any.required": "Scheduled start date is required",
  }),

  oldPrice: Joi.number().positive().required().messages({
    "number.base": "Old price must be a number",
    "number.positive": "Old price must be greater than 0",
    "any.required": "Old price is required",
  }),

  newPrice: Joi.number().positive().less(Joi.ref("oldPrice")).required().messages({
    "number.base": "New price must be a number",
    "number.positive": "New price must be greater than 0",
    "number.less": "New price must be less than the old price",
    "any.required": "New price is required",
  }),

  freeDelivery: Joi.boolean().required().messages({
    "boolean.base": "Free delivery must be true or false",
    "any.required": "Free delivery status is required",
  }),

  deliveryAmount: Joi.when("freeDelivery", {
    is: false,
    then: Joi.number().min(1).required().messages({
      "number.min": "Delivery amount must be at least 1 if free delivery is false",
      "number.base": "Delivery amount must be a number",
      "any.required": "Delivery amount is required if free delivery is false",
    }),
    otherwise: Joi.forbidden(),
  }),

  images: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    "array.min": "At least one product image is required",
    "string.uri": "Each image must be a valid URL",
    "any.required": "Product images are required",
  }),

  productURL: Joi.string().uri().required().messages({
    "string.uri": "Product URL must be a valid URL",
    "string.empty": "Product URL cannot be empty",
    "any.required": "Product URL is required",
  }),

  isDeleted: Joi.boolean().default(false).messages({
    "boolean.base": "isDeleted must be true or false",
  }),

  ratings: Joi.object({
    average: Joi.number().min(0).max(5).default(0).messages({
      "number.min": "Average rating must be at least 0",
      "number.max": "Average rating cannot be more than 5",
    }),
    totalReviews: Joi.number().min(0).default(0).messages({
      "number.min": "Total reviews cannot be negative",
    }),
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.string().custom(objectId).required().messages({
          "any.required": "Review user ID is required",
        }),
        rating: Joi.number().min(1).max(5).required().messages({
          "number.min": "Rating must be at least 1",
          "number.max": "Rating cannot be more than 5",
          "any.required": "Rating is required",
        }),
        comment: Joi.string().trim().max(500).messages({
          "string.max": "Comment cannot exceed 500 characters",
        }),
        createdAt: Joi.date().default(Date.now).messages({
          "date.base": "Invalid date format for createdAt",
        }),
      })
    ),
  }),

  isFeatured: Joi.boolean().default(false).messages({
    "boolean.base": "isFeatured must be true or false",
  }),

  isAvailable: Joi.boolean().default(true).messages({
    "boolean.base": "isAvailable must be true or false",
  }),
});

export default productValidation;
