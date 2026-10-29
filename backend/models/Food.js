
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      required: [true, "Ma mon an la bat buoc"],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Ten mon an la bat buoc"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Loai mon an la bat buoc"],
      trim: true
    },
    cuisine: {
      type: String,
      required: [true, "Vung mien la bat buoc"],
      trim: true
    },
    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: (items) =>
          items.length > 0 &&
          items.every((item) => item.trim().length > 0),
        message: "Phai co it nhat 1 nguyen lieu hop le"
      }
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Gia khong duoc am"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "So luong khong duoc am"],
      validate: {
        validator: Number.isInteger,
        message: "So luong phai la so nguyen"
      }
    },
    description: {
      type: String,
      required: [true, "Mo ta la bat buoc"],
      trim: true
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    collection: "foods",
    timestamps: true
  }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
