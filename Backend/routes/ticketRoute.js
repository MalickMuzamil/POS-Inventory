import express from "express";
import protect from "../middleware/authMiddleware.js";
import TicketController from "../controllers/TicketRaise.js";

const router = express.Router();

router.post("/create-ticket", protect, TicketController.create);

router.get("/my-tickets", protect, TicketController.getMyTickets);

router.patch("/update-ticket/:id", protect, TicketController.update);

router.delete("/delete-ticket/:id", protect, TicketController.Delete);

export default router;
