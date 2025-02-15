import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    scheduledStartDate: { type: Date, required: true },
    expiryDate: { type: Date},
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    freeDelivery: { type: Boolean, default: false },
    deliveryAmount: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    productURL: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},

    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String, trim: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("discountPercentage").get(function () {
  if (!this.oldPrice || !this.newPrice || this.oldPrice <= this.newPrice) return 0;
  return parseFloat(((this.oldPrice - this.newPrice) / this.oldPrice * 100).toFixed(2));
});

productSchema.virtual("discountAmount").get(function () {
  if (!this.oldPrice || !this.newPrice || this.oldPrice <= this.newPrice) return 0;
  return parseFloat((this.oldPrice - this.newPrice).toFixed(2));
});

export default mongoose.model("Product", productSchema);
