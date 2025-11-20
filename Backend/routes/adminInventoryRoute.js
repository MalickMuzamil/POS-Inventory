import express from "express";
import RefreshmentController from "../controllers/RefreshmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-inventory", protect, RefreshmentController.create);
router.get("/all-inventory", protect, RefreshmentController.getAll);
router.patch("/update-inventory/:id", protect, RefreshmentController.update); //batchID
router.delete("/delete-inventory/:id", protect, RefreshmentController.delete);

export default router;
