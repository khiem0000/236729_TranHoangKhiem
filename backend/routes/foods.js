
import express from "express";
import mongoose from "mongoose";
import Food from "../models/Food.js";

const router = express.Router();

const fields = [
  "foodId",
  "name",
  "category",
  "cuisine",
  "ingredients",
  "price",
  "quantity",
  "description",
  "imageUrl"
];

// Cho phep tim theo foodId hoac MongoDB _id
function findById(id) {
  if (mongoose.isValidObjectId(id)) {
    return {
      $or: [{ _id: id }, { foodId: id }]
    };
  }
  return { foodId: id };
}

// Chi nhan cac truong hop le
async function validatePayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("Du lieu phai la JSON object");
    error.status = 400;
    throw error;
  }

  const data = {};

  for (const field of fields) {
    if (Object.hasOwn(body, field)) {
      data[field] = body[field];
    }
  }

  const temp = new Food(data);
  await temp.validate();

  const result = temp.toObject();
  delete result._id;
  delete result.__v;

  return result;
}

function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "Ma mon an foodId da ton tai"
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      message: "Du lieu khong hop le",
      errors: error.errors
        ? Object.values(error.errors).map((e) => e.message)
        : [error.message]
    });
  }

  if (error.status === 400) {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error("API error:", error.message);

  return res.status(503).json({
    message: "Khong the xu ly yeu cau, kiem tra ket noi database"
  });
}

// GET /api/foods
// GET /api/foods?search=pho
router.get("/", async (req, res) => {
  try {
    const search = req.query.search ?? "";

    if (typeof search !== "string" || search.length > 100) {
      return res.status(400).json({
        message: "Tu khoa tim kiem khong hop le"
      });
    }

    const keyword = search.trim();
    let filter = {};

    if (keyword) {
      const safe = keyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter = {
        $or: [
          { name: { $regex: safe, $options: "i" } },
          { category: { $regex: safe, $options: "i" } },
          { cuisine: { $regex: safe, $options: "i" } }
        ]
      };
    }

    const foods = await Food.find(filter).sort({ foodId: 1 });

    res.status(200).json(foods);
  } catch (error) {
    sendError(res, error);
  }
});

// GET /api/foods/:id
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findOne(findById(req.params.id));

    if (!food) {
      return res.status(404).json({
        message: "Khong tim thay mon an"
      });
    }

    res.json(food);
  } catch (error) {
    sendError(res, error);
  }
});

// POST /api/foods
router.post("/", async (req, res) => {
  try {
    const data = await validatePayload(req.body);
    const food = await Food.create(data);

    res.status(201).json({
      message: "Them mon an thanh cong",
      food
    });
  } catch (error) {
    sendError(res, error);
  }
});

// PUT /api/foods/:id
router.put("/:id", async (req, res) => {
  try {
    const data = await validatePayload(req.body);
    const food = await Food.findOne(findById(req.params.id));

    if (!food) {
      return res.status(404).json({
        message: "Khong tim thay mon an"
      });
    }

    Object.assign(food, data);
    await food.save();

    res.json({
      message: "Cap nhat mon an thanh cong",
      food
    });
  } catch (error) {
    sendError(res, error);
  }
});

// DELETE /api/foods/:id
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findOneAndDelete(
      findById(req.params.id)
    );

    if (!food) {
      return res.status(404).json({
        message: "Khong tim thay mon an"
      });
    }

    res.json({
      message: "Xoa mon an thanh cong",
      foodId: food.foodId
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
